function table2Schema(array) {
  if (array.length === 0) {
    return null;
  }
  const obj = {};
  const map = new Map();
  for (const i of array) {
    if (i.type === 'array[object]') {
      map.set(i.name, {
        type: 'array',
        description: i.description,
        example: i.example,
        items: {
          type: 'object',
          properties: table2Schema(i.children),
        },
      });
    } else if (i.type.search('array') !== -1) {
      map.set(i.name, {
        type: 'array',
        description: i.description,
        example: i.example,
        items: {
          type: i.type.substring(6, i.type.length - 1),
        },
      });
    } else {
      map.set(i.name, {
        type: i.type,
        description: i.description,
        example: i.example,
        properties: table2Schema(i.children),
      });
    }
  }
  for (const [key, value] of map) {
    obj[key] = value;
  }
  return obj;
}

 function schema2Table(obj) {
  const array = [];
  if (_.isNil(obj) || _.isEmpty(obj)) {
    return [];
  }
  for (const key in obj) {
    if (obj[key].type === 'array') {
      array.push({
        name: key,
        type: obj[key].items.type === 'object' ? 'array[object]' : `array[${obj[key].items.type}]`,
        description: !_.isNil(obj[key].description) ? obj[key].description : '',
        example: !_.isNil(obj[key].example) ? obj[key].example : '',
        children: obj[key].items.type === 'object' ? schema2Table(obj[key].items.properties) : [] });
    } else {
      array.push({
        name: key,
        type: obj[key].type,
        description: !_.isNil(obj[key].description) ? obj[key].description : '',
        example: !_.isNil(obj[key].example) ? obj[key].example : '',
        children: schema2Table(obj[key].properties),
      });
    }
  }
  return array;
}

 function schema2Display(obj) {
  const objClone = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj) {
    if (obj[key].type === 'object') {
      objClone[key] = schema2Display(obj[key].properties);
    } else if (obj[key].type === 'array' && obj[key].items.type === 'object') {
      objClone[key] = [schema2Display(obj[key].items.properties)];
    } else if (obj[key].type === 'array' && obj[key].items.type !== 'object') {
      objClone[key] = [obj[key].items.type];
    } else {
      objClone[key] = obj[key].type;
    }
  }
  return objClone;
}

 function json2Schema(obj) {
  const objClone = {};
  for (const key in obj) {
    const type = typeof(obj[key]);
    if (type === 'object' && !Array.isArray(obj[key])) {
      objClone[key] = {
        example: '',
        type: 'object',
        description: '',
        properties: json2Schema(obj[key]),
      };
    } else if (Array.isArray(obj[key])) {
      for (let i = 1;i < obj[key].length;i++) {
        if (typeof obj[key][i] !== typeof obj[key][i - 1]) {
          return '暂不支持';
        }
      }
      if (typeof obj[key][0] === 'object') {
        objClone[key] = {
          example: [obj[key][0]],
          type: 'array',
          description: '',
          items: {
            type: 'object',
            properties: json2Schema(obj[key][0]),
          },
        };
      } else {
        objClone[key] = {
          example: obj[key],
          type: 'array',
          description: '',
          items: {
            type: typeof obj[key][0],
          },
        };
      }
    } else {
      objClone[key] = {
        type: typeof obj[key],
        example: obj[key],
        description: '',
        properties: null,
      };
    }
  }
  return objClone;
}

 function schema2Json(obj) {
  const objClone = {};
  for (const key in obj) {
    if (obj[key].type === 'object') {
      objClone[key] = schema2Json(obj[key].properties);
    } else if (obj[key].type === 'array') {
      if (obj[key].items.type === 'object') {
        objClone[key] = [schema2Json(obj[key].items.properties)];
      } else {
        objClone[key] = obj[key].example ?? '[]';
      }
    } else {
      objClone[key] = obj[key].example ?? '';
    }
  }
  return objClone;
}

// // 这是一个json-schema的结构
// let a = {"sex":{
//   "type": "object",
//   "properties": {
//     "city": { "type": "string","example":"beijing" },
//     "number": { "type": "number" },
//     "user": { 
//         "type": "object",
//         "properties": {
//             "name" : {"type": "string"},
//             "age" : {"type": "number"}
//         }                       
//     }
// }
// }
// }

// // 这是被转化之后的json结构
// let json = {
// "sex": {
// "city": "beijing",
// "number": "",
// "user": {
//   "name": "",
//   "age": ""
// }
// }
// }

// // 这是一个树状组件结构
// let data = [
// {
// "name": "sex",
// "type": "object",
// "description": "",
// "example": "",
// "children": [
//   {
//     "name": "city",
//     "type": "string",
//     "description": "",
//     "example": "beijing",
//     "children": []
//   },
//   {
//     "name": "number",
//     "type": "number",
//     "description": "",
//     "example": "",
//     "children": []
//   },
//   {
//     "name": "user",
//     "type": "object",
//     "description": "",
//     "example": "",
//     "children": [
//       {
//         "name": "name",
//         "type": "string",
//         "description": "",
//         "example": "",
//         "children": []
//       },
//       {
//         "name": "age",
//         "type": "number",
//         "description": "",
//         "example": "",
//         "children": []
//       }
//     ]
//   }
// ]
// }
// ]

// let b = JSON.stringify(schema2Json(a),null,2);
// let c = schema2Display(a);
// let d = JSON.stringify(schema2Table(a),null,2);
// console.log('我是json',b);
// console.log('我是display',c);
// console.log('我是table',d);

export {schema2Json,json2Schema,schema2Table,schema2Display,table2Schema}