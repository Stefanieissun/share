
//创建createCollection 的 validator
const createVal = (obj,arr) => {
	let validate = {
		validator: {
			$jsonSchema: {
				bsonType: 'object',
				required: 'arr',
				properties: 1
			}
		}
	};
    let arr1 = Object.keys(obj);
    let val=validate.validator.$jsonSchema;
	val.required = arr;

	arr1.map((x) => {
		obj[x] = { bsonType: `${obj[x]}` };
	});
	val.properties = obj;
	return validate;
};


module.exports=createVal;


