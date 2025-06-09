 BRANCH?=$(shell git rev-parse --abbrev-ref HEAD | sed -e 's/prod/mainnet/g;s/develop/testnet/g;')
BUILDTAG?=$(shell git rev-parse --abbrev-ref HEAD | sed -e 's/prod/mainnet/g;s/develop/testnet/g;')
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
	docker push ${GCR}/${IMAGENAME}:${GITREF}_${VERSION}

azure-push:
	docker push ${AZURE}/${IMAGENAME}:${GITREF}_${VERSION}

docker-build: ecr-check pull
	docker build \
		--build-arg OPENAI_API_KEY=${OPENAI_API_KEY} \
		-f ./Dockerfile \
		-t ${GCR}/${IMAGENAME}:${GITREF}_${VERSION} \
		-t ${AZURE}/${IMAGENAME}:${GITREF}_${VERSION} .

azure-build: azure-check pull
	docker build \
		--build-arg OPENAI_API_KEY=${OPENAI_API_KEY} \
		-f ./Dockerfile \
		-t ${AZURE}/${IMAGENAME}:${GITREF}_${VERSION} .

push-tag:
	bash ./push_tag.sh ${VERSION}

release: docker-build docker-push push-tag

azure-release: azure-build azure-push

push-only-image: docker-build docker-push

print-vars:
	@echo "GITREF=$(GITREF)"
	@echo "VERSION=$(VERSION)"
	@echo "OPENAI_API_KEY=$(if $(OPENAI_API_KEY),set,not set)"
	@echo "NODE_ENV=$(NODE_ENV)"

.PHONY: pull region-check ecr-check azure-check docker-push azure-push docker-build azure-build push-tag release azure-release push-only-image print-vars