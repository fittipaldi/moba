# Moba Game Server

This server is running the socketIO and for this we need to run the socketIO server

### Docker - create image

I am using the image name as `moba-socketio-app`
```bash
docker build -t name-of-image .
```

### Kubernets - deploy the application

```bash
kubectl apply -f deployment.yaml
```