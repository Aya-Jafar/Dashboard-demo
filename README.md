# Dashboard Demo

[![Vue 3](https://img.shields.io/badge/Vue%203-4FC08D?logo=vue.js&logoColor=white&style=for-the-badge)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white&style=for-the-badge)](https://vitejs.dev/)

This is the repo's for software engineering tasks


# Dynamic Tree

I used [Mock API](https://mockapi.io) and generate data with this structure:

```json
{
  "id": "dept-root-1",
  "label": "Human Resources",
  "parentId": null,
  "createdAt": 1637003251499,
  "description": "Handles recruitment, employee relations, and benefits.",
  "numberOfEmployees": 21
}
```

The data was splied into 3 resourses due to the limit of the Mock API (with the paid version as well) and with using the same fetch approch and switching between differnt resources.
All used resourses are stored in `/src/utils/endpoints.ts`.
I also thought this could be a **simulation for real scenarios where big data is stored in multiple servers or resources**.
![img](/src/assets/image.png)

### Lazy Loading Mechanism with node toggle

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
  :visible="!node.visible"
  @toggle="store.toggleNodeVisibility(node.id)"
  @show-details="showNodeDetails"
  @create-node="handleCreateNode"
  @node-move="store.moveNode"
/>
```

The recursion naturally terminates when a node has no children (empty children array).

[![Watch the video](/src/assets/Screenshot%202025-03-28%20at%209.45.05%20PM.png)](/src/assets/Screen%20Recording%202025-03-28%20at%209.36.58%20PM.mp4)

![search](/src/assets/2025-03-30%2003.53.18.jpg)

### Virtualization with lazy loading

For the main nodes data, I used [@vueuse/core](https://vueuse.org/) to implement the virtualization and lazy loading with scroll.

```ts
const {
  list: virtualNodes,
  containerProps,
  wrapperProps,
} = useVirtualList(
  computed(() => store.nodes),
  { itemHeight: 20 } // Height of each node
);
```

### Metric

![alt](/src/assets/image%20copy.png)

# Dashboard 📈

### 1. WebSocket Service:

- Created a mock WebSocket service (`/src/services/WebSocketService.ts`)
- Simulates real-time data updates by generating new data every 5 seconds
- Automatically receonnect if some failure happens

Example usage:

```ts
const ws = new MockWebSocket(import.meta.env.VITE_MOCK_WEB_SOCKET_URL);
ws.connect();
```

### 2. Charting and UI:

- Implemented using [apexcharts](https://apexcharts.com/)
- Used similar color schema and took UI inspiration from [this design](https://i.pinimg.com/736x/a8/8d/6a/a88d6a49607e0232966d655a8e00ac00.jpg)

![alt](/src/assets/result.jpg)

![alt](/src/assets/result-ar.jpg)


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
