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

export {schema2Json,json2Schema,schema2Table,schema2Display,table2Schema}