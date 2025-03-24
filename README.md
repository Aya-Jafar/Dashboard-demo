# Tasks Demo

## Vue 3 + TypeScript + Vite

This is the repo's for software engineering tasks


# First Task docs- Dynamic Tree

I used [Mock API](https://mockapi.io) and generate data with this structure:

```
{
    "id": "dept-root-1",
    "label": "Human Resources",
    "parentId": null,
    "createdAt": 1637003251499,
    "description": "Handles recruitment, employee relations, and benefits.",
    "numberOfEmployees": 21
},
```

Insetead of nesting objects for parents and children (which I tried at first but could not find a possiable way to do the lazy loading with it),This will provide the lazy loading functionality by filtering based on the parentId only to get the children

For example, to get the initial depratments children
The request will be like this:

```
GET "API_BASE_URL/departments?parentId=null"
```

Same for it's children and grand children

![alt-image](/src/assets/Screenshot%202025-03-24%20at%201.27.38%20PM.png)


# Second Task docs - Dashboard 📈

For the second task, I implemented a mock web socket service (src/services/WebSocketService.ts) that mimicks the functionality of a web socket, it generates new data every 3 seconds and push it to the old ones and show it in real time.

```
const ws = new MockWebSocket(import.meta.env.VITE_MOCK_WEB_SOCKET_URL);
ws.connect();
```

For the charts I used [apexcharts](https://apexcharts.com/)

![alt-image](/src/assets/Screenshot%202025-03-24%20at%201.33.22%20PM.png)
