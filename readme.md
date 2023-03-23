# 一个用于json-schema json tableComponent UI库所需数组的相互转化的功能函数库

基于js编写，后续会完善函数算法并更新ts版本。目前未做打包、压缩等处理

使用方式：npm i sj-jsonschema-table-json --save

```typescript
import {json2Schema,schema2Json,schema2Displya,table2Schema,schema2Table}

// 这是一个json-schema的结构
let a = {"sex":{
  "type": "object",
  "properties": {
    "city": { "type": "string","example":"beijing" },
    "number": { "type": "number" },
    "user": { 
        "type": "object",
        "properties": {
            "name" : {"type": "string"},
            "age" : {"type": "number"}
        }                       
    }
}
}
}

// 这是被转化之后的json结构
let json = {
"sex": {
"city": "beijing",
"number": "",
"user": {
  "name": "",
  "age": ""
}
}
}

// 这是一个树状组件结构
let data = [
{
"name": "sex",
"type": "object",
"description": "",
"example": "",
"children": [
  {
    "name": "city",
    "type": "string",
    "description": "",
    "example": "beijing",
    "children": []
  },
  {
    "name": "number",
    "type": "number",
    "description": "",
    "example": "",
    "children": []
  },
  {
    "name": "user",
    "type": "object",
    "description": "",
    "example": "",
    "children": [
      {
        "name": "name",
        "type": "string",
        "description": "",
        "example": "",
        "children": []
      },
      {
        "name": "age",
        "type": "number",
        "description": "",
        "example": "",
        "children": []
      }
    ]
  }
]
}
]

let b = JSON.stringify(schema2Json(a),null,2);
let c = schema2Display(a);
let d = JSON.stringify(schema2Table(a),null,2);
```