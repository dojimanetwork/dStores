BRANCH?=$(shell git rev-parse --abbrev-ref HEAD | sed -e 's/master/mainnet/g;s/develop/testnet/g;')
BUILDTAG?=$(shell git rev-parse --abbrev-ref HEAD | sed -e 's/master/mainnet/g;s/develop/testnet/g;')
GITREF=$(shell git rev-parse --short HEAD)

# pull branch name from CI, if available
ifdef CI_COMMIT_BRANCH
	BRANCH=$(shell echo ${CI_COMMIT_BRANCH} | sed 's/prod/mainnet/g')
	BUILDTAG=$(shell echo ${CI_COMMIT_BRANCH} | sed -e 's/prod/mainnet/g;s/develop/testnet/g;s/testnet-multichain/testnet/g')
endif

VERSION=$(shell bash ./get_next_tag.sh ${INCREMENT_TYPE})
TAG=$(shell date +%Y-%m-%d)
DATE=$(shell date +%Y-%m-%d)

# Environment variables
export OPENAI_API_KEY ?= $(shell echo $$OPENAI_API_KEY)
export NODE_ENV ?= production

# Image name and tag
IMAGENAME ?= web3-stores
IMAGETAG ?= ${GITREF}_${VERSION}

# ------------------------------- GitHub ------------------------------- #

pull: ## Git pull repository
	@git clean -idf
	@git pull origin $(shell git rev-parse --abbrev-ref HEAD)

region-check:
	@if [ -z "${REGION}" ]; then\
        	echo "add region env variable";\
        	exit 1;\
    fi

ecr-check:
	@if [ -z "${GCR}" ] && [ -z "${AZURE}"]; then\
    		echo "add gcr and azure env variable";\
    		exit 1;\
    fi

azure-check:
	@if [ -z "${AZURE}"]; then\
		echo "add azure env variable";\
		exit 1;\
	fi

docker-push: ecr-check
	@if [ -n "${GCR}" ]; then\
		docker push ${GCR}/${IMAGENAME}:${IMAGETAG};\
	fi

azure-push:
	@if [ -n "${AZURE}" ]; then\
		docker push ${AZURE}/${IMAGENAME}:${IMAGETAG};\
	fi

docker-build: ecr-check pull
	@echo "Building Docker image..."
	@echo "Image name: ${IMAGENAME}"
	@echo "Image tag: ${IMAGETAG}"
	@echo "GCR: ${GCR}"
	@echo "AZURE: ${AZURE}"
	@if [ -n "${GCR}" ] && [ -n "${AZURE}" ]; then\
		docker build \
			--build-arg OPENAI_API_KEY=${OPENAI_API_KEY} \
			-f ./Dockerfile \
			-t ${GCR}/${IMAGENAME}:${IMAGETAG} \
			-t ${AZURE}/${IMAGENAME}:${IMAGETAG} .;\
	elif [ -n "${GCR}" ]; then\
		docker build \
			--build-arg OPENAI_API_KEY=${OPENAI_API_KEY} \
			-f ./Dockerfile \
			-t ${GCR}/${IMAGENAME}:${IMAGETAG} .;\
	elif [ -n "${AZURE}" ]; then\
		docker build \
			--build-arg OPENAI_API_KEY=${OPENAI_API_KEY} \
			-f ./Dockerfile \
			-t ${AZURE}/${IMAGENAME}:${IMAGETAG} .;\
	else\
		echo "Error: Neither GCR nor AZURE registry is set";\
		exit 1;\
	fi

azure-build: azure-check pull
	@echo "Building Docker image for Azure..."
	@echo "Image name: ${IMAGENAME}"
	@echo "Image tag: ${IMAGETAG}"
	@echo "AZURE: ${AZURE}"
	docker build \
		--build-arg OPENAI_API_KEY=${OPENAI_API_KEY} \
		-f ./Dockerfile \
		-t ${AZURE}/${IMAGENAME}:${IMAGETAG} .

push-tag:
	bash ./push_tag.sh ${VERSION}

release: docker-build docker-push push-tag

azure-release: azure-build azure-push

push-only-image: docker-build docker-push

print-vars:
	@echo "GITREF=$(GITREF)"
	@echo "VERSION=$(VERSION)"
	@echo "IMAGETAG=$(IMAGETAG)"
	@echo "OPENAI_API_KEY=$(if $(OPENAI_API_KEY),set,not set)"
	@echo "NODE_ENV=$(NODE_ENV)"
	@echo "GCR=$(GCR)"
	@echo "AZURE=$(AZURE)"

.PHONY: pull region-check ecr-check azure-check docker-push azure-push docker-build azure-build push-tag release azure-release push-only-image print-vars