# Bank-statement-Search-website
A website that helps you search bank statements quickly

## Pull Image and run container
### Pull Image from Docker Hub

On Terminal, run the following command:
```bash
docker pull thuanvu301103/bank-statement-app:v1.0
```

### Run container
```bash
docker run -d -p 3000:3000 thuanvu301103/bank-statement-app:v1.0
```

## Kill process (server) running on specific port:
- Find PID of server running on port:
	```
	netstat -ano | findstr :<Port number>
	```
- Kill that process:
	```
	taskkill /F /PID <PID>
	```


