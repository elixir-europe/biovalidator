## Memory usage and testing

To increase the heap memory used by the old_space, we can use following VM argument. The `--inspect` flag allows to inspect GC logs. 
Start with 4GB of heap old_space
```shell
export NODE_OPTIONS=--max_old_space_size=4096
node --inspect src/biovalidator.js
```

To start the heap profiler when starting the NodeJs application, use `--trace-gc` flag. 
Heap Profiler + GC Traces
```shell
node --inspect --trace-gc src/biovalidator.js
```
Following code snippet shows how you can make a `curl` request to validator, or run load test using Apache Benchmark. 

## Testing memory usage
```shell

data=`cat ./examples/objects/test-schema-valid.json`
schema=`cat ./examples/schemas/test-schema.json`              
request_data="{\"schema\": $schema, \"data\": $data}"
echo $request_data  
curl -H "Content-Type: application/json" -X POST http://localhost:3020/validate -d "$request_data"

data=`cat ../../examples/objects/test-schema-valid.json`
schema=`cat ../../examples/schemas/test-schema.json`              
request_data="{\"schema\": $schema, \"data\": $data}"
echo $request_data  
echo $request_data >> test.json
ab -p test.json -T application/json -c 5 -n 1000 http://localhost:3020/validate

jq . ./examples/schemas/test-schema.json
   
request_data=`jq -s '{data: .[0], schema: .[1]'} ./examples/objects/test-schema-valid.json ./examples/schemas/test-schema.json`
curl -H "Content-Type: application/json" -X POST http://localhost:3020/validate -d "$request_data"

dataPath=../../examples/objects/test-schema-valid.json
schemaPath=../../examples/schemas/test-schema.json  

validate($schemaPath, $dataPath)

function validate(schemaPath, dataPath) {
    request_data=`jq -s '{data: .[0], schema: .[1]'} $dataPath $schemaPath`
    curl -H "Content-Type: application/json" -X POST http://localhost:3020/validate -d "$request_data"
}

```
