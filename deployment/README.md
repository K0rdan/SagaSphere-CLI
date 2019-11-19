# Deployment

## Network

docker network create sagasphere

## Containers

### Helm

`docker run --rm --name helm -it --network sagasphere --network-alias=['helm'] -v $(pwd)/deployment:/apps -v /c/Users/benjamin/.kube:/root/.kube/ -v /c/Users/benjamin/.helm:/root/.helm --entrypoint=/bin/sh alpine/helm:3.0.0-rc.2`

#### Configurations

- `apk add git`
- `helm repo add SagaSphere-GraphQL 'https://raw.githubusercontent.com/K0rdan/SagaSphere-GraphQL/master/deployment'`
- `helm plugin install https://github.com/chartmuseum/helm-push`
- `helm repo add chartmuseum http://chartmuseum:8080`
- `helm push ./charts/\* http://chartmuseum:8080`

### Chartmuseum

`docker run --rm --name chartmuseum -it --network sagasphere --network-alias=['chartmuseum'] -p 8080:8080 -v \$(pwd)/deployment:/charts -e DEBUG=true -e STORAGE=local -e STORAGE_LOCAL_ROOTDIR=/charts chartmuseum/chartmuseum`
