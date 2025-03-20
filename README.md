# Tasks Demo

## Vue 3 + TypeScript + Vite

This is the repo's for software engineering tasks

# First Task docs- Dynamic Tree 🌳

I used [Mock API](https://mockapi.io) and generate data with this structure:

```
{
    "id":"parent-1-dept-1"
    "parentID":"parent-1",
    "label":"Human Resources",
    "createdAt":"10-10-2024"
}
```

Insetead of nesting objects for parents and children (which I tried at first but could not find a possiable way to do the lazy loading with it),This will provide the lazy loading functionality by filtering based on the parentId only to get the children

For example, to get the initial depratments children
The request will be like this:

```
GET "API_BASE_URL/departments?parentId=null"
```

Same for it's children and grand children


# Second Task docs - Dashboard 📈



[script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.
