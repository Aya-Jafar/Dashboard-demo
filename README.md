# Tasks Demo

## Vue 3 + TypeScript + Vite

This is the repo's for software engineering tasks


# First Task docs - Dynamic Tree

I used [Mock API](https://mockapi.io) and generate data with this structure:

```json
{
    "id": "dept-root-1",
    "label": "Human Resources",
    "parentId": null,
    "createdAt": 1637003251499,
    "description": "Handles recruitment, employee relations, and benefits.",
    "numberOfEmployees": 21
},
```
### Lazy Loading Mechanism

Insetead of nesting objects for parents and children (which I tried at first but could not find a possiable way to do the lazy loading with it),This will provide the lazy loading functionality by filtering based on the parentId only to get the children

For example, to get the initial depratments children
The request will be like this:

```shell
GET "API_BASE_URL/departments?parentId=null"
```

This same pattern applies to children and grandchildren nodes.


### Recursive component implementation 
The dynamic tree structure is implemented using a recursive TreeNode component that renders itself for each child node
```html
<!-- In TreeNode.vue -->
    <TreeNode
        :node="node"
        :visible="node.visible !== false"
        @toggle="store.toggleNodeVisibility(node.id)"
        @show-details="showNodeDetails"
        @create-node="handleCreateNode"
        @node-move="store.moveNode"
    />
```
The recursion naturally terminates when a node has no children (empty children array).

<!-- 
![alt-image](/src/assets/Screen%20Recording%202025-03-28%20at%209.36.58%20PM.mp4)
 -->


[![Watch the video](/src/assets/Screenshot%202025-03-28%20at%209.45.05%20PM.png)](/src/assets/Screen%20Recording%202025-03-28%20at%209.36.58%20PM.mp4)


# Second Task docs - Dashboard 📈

### 1. WebSocket Service:
- Created a mock WebSocket service (src/services/WebSocketService.ts)
- Simulates real-time data updates by generating new data every 5 seconds
- Automatically receonnect if some failure happens

Example usage:
```ts
const ws = new MockWebSocket(import.meta.env.VITE_MOCK_WEB_SOCKET_URL);
ws.connect();
```

### 2. Charting:

- Implemented using [apexcharts](https://apexcharts.com/)

![alt-image](/src/assets/Screenshot%202025-03-28%20at%209.33.30%20PM.png)



## Development Setup


1. Clone the repository 
```shell
git clone https://github.com/Aya-Jafar/SWE-task.git
```
2. Install dependencies
```shell
npm install
```
3. Run development server
```shell
npm run dev
```
