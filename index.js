import {execSync} from 'child_process'
import {Worker } from 'node:worker_threads'

function getCurrentThreadCount(){
      // obtem quantidade de threadds do process e conta
    return parseInt(execSync(`ps -M ${process.pid} | wc -l`).toString())
}

function createThread(data){
    const worker = new Worker('./thread.js')

    const p = new Promise((resolve, reject)=>{

        worker.once('message', (message)=>{
            return resolve(message)
        })

        worker.once('error', reject)
    })

    worker.postMessage(data)

    return  p
}

const nodejsDefaultThreadNumber = getCurrentThreadCount() -1 // ignora o processo


let nodejsThreadCount =0;

const inntervalId = setInterval(()=>{
    // console.log(`running at every sec:  ${new Date().toISOString()}`);

    //dessa forma vemos somente as threads que criamos manualmente
    const currentThreads = getCurrentThreadCount() - nodejsDefaultThreadNumber
    if(currentThreads == nodejsThreadCount ) return

    nodejsThreadCount = currentThreads

    console.log(`threads ${nodejsThreadCount}`);
})



console.log(`Im running `, process.pid,
`default threds ${nodejsDefaultThreadNumber}`
);


// isso trava o node
// for(let i =0; i< 1e20; i++);

await Promise.all([
    createThread(
        {from: 0, to: 1e9}
    ),
    createThread(
        {from: 0, to: 1e9}
    ),
    createThread(
        {from: 0, to: 1e8}
    ),
    createThread(
        {from: 0, to: 1e10}
    ),
    createThread(
        {from: 0, to: 1e3}
    )
]).then(results=>{
    console.log(results);
})

clearInterval(inntervalId)