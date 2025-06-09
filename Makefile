BRANCH?=$(shell git rev-parse --abbrev-ref HEAD | sed -e 's/master/mainnet/g;s/develop/testnet/g;')
BUILDTAG?=$(shell git rev-parse --abbrev-ref HEAD | sed -e 's/master/mainnet/g;s/develop/testnet/g;')
GITREF=$(shell git rev-parse --short HEAD)

# pull branch name from CI, if available
ifdef CI_COMMIT_BRANCH
	BRANCH=$(shell echo ${CI_COMMIT_BRANCH} | sed 's/prod/mainnet/g')
	BUILDTAG=$(shell echo ${CI_COMMIT_BRANCH} | sed -e 's/prod/mainnet/g;s/develop/testnet/g;s/testnet-multichain/testnet/g')
endif

# Default to patch version increment if not specified
INCREMENT_TYPE ?= patch

# Ensure get_next_tag.sh is executable
$(shell chmod +x ./get_next_tag.sh)

# Get version with fallback
VERSION=$(shell ./get_next_tag.sh ${INCREMENT_TYPE} 2>/dev/null || echo "0.0.1")
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
	@echo "Pulling latest changes..."
	@if ! git fetch --tags 2>/dev/null; then\
		echo "Warning: Could not fetch tags. Using local tags only.";\
	fi
	@if ! git pull origin $(shell git rev-parse --abbrev-ref HEAD) 2>/dev/null; then\
		echo "Warning: Could not pull changes. Using local changes only.";\
	fi

region-check:
	@if [ -z "${REGION}" ]; then\
        	echo "Error: REGION environment variable is not set";\
        	exit 1;\
    fi

ecr-check:
	@if [ -z "${GCR}" ] && [ -z "${AZURE}"]; then\
    		echo "Error: Neither GCR nor AZURE registry is set";\
    		echo "Please set either GCR or AZURE environment variable";\
    		exit 1;\
    fi

azure-check:
	@if [ -z "${AZURE}"]; then\
		echo "Error: AZURE registry is not set";\
		echo "Please set the AZURE environment variable";\
		exit 1;\
	fi

docker-push: ecr-check
	@if [ -n "${GCR}" ]; then\
		echo "Pushing to GCR: ${GCR}/${IMAGENAME}:${IMAGETAG}";\
		docker push ${GCR}/${IMAGENAME}:${IMAGETAG};\
	fi

azure-push:
	@if [ -n "${AZURE}" ]; then\
		echo "Pushing to Azure: ${AZURE}/${IMAGENAME}:${IMAGETAG}";\
		docker push ${AZURE}/${IMAGENAME}:${IMAGETAG};\
	fi

docker-build: ecr-check pull
	@echo "Building Docker image..."
	@echo "Image name: ${IMAGENAME}"
	@echo "Image tag: ${IMAGETAG}"
	@echo "Version: ${VERSION}"
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
	@echo "Version: ${VERSION}"
	@echo "AZURE: ${AZURE}"
	docker build \
		--build-arg OPENAI_API_KEY=${OPENAI_API_KEY} \
		-f ./Dockerfile \
		-t ${AZURE}/${IMAGENAME}:${IMAGETAG} .

push-tag:
	@echo "Pushing new tag: ${VERSION}"
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
	@echo "INCREMENT_TYPE=$(INCREMENT_TYPE)"

.PHONY: pull region-check ecr-check azure-check docker-push azure-push docker-build azure-build push-tag release azure-release push-only-image print-vars