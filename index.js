const express = require('express')
const bodyParser = require('body-parser') 
const cors = require('cors')
const { MongoClient } = require('mongodb'); // mongodb는 query문 안 써도 db 조회, 넣기. 빼기, 수정등이 가능
const app = express()
 
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const url = "mongodb+srv://tlatlago824:ljJlxOITgoeMzeX3@cluster0.qkekbll.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);

let collection;

const dbConnect = async () => {
    await client.connect();
    const db = client.db('test');
    collection = db.collection('countCollection');

    console.log('접속성공!');
}//dbConnect() 함수정의

app.get('/api',async function (req, res) {
    const result = await collection.find().toArray(); // 이렇게 해서 정보 빼올 수 있음
    res.send(result);  
})

app.post('/api/insert',async function (req, res) {
    await collection.insertOne(req.body); // 값 넣기 // insertMany([{ a: 1 }, { a: 2 }, { a: 3 }]) //이렇게 한꺼번에 여러개 넣기도 가능
    const result = await collection.find().toArray();
    res.send(result);  
})

app.delete('/api/delete',async function (req, res) {
    const {date} = req.query; // /api/delete?date=20231030

    // date가 Double로 저장되어 있어서 숫자로 바꿔줘야 인식함 
    // 필드 date가 Number(date)(= query로 가져온 date)인 레코드 삭제
    await collection.deleteOne({date: Number(date)}); 
    const result = await collection.find().toArray();
    res.send(result);  
})

app.put('/api/update',async function (req, res) {
    const {date} = req.query; 
    const {count} = req.body;
    await collection.updateOne({date: Number(date)}, {$set: {count}}); // $set: 수정할 필드를 말함{count: count}(count필드내용을 count(body로 가져온)값으로 바꿔주기)
    const result = await collection.find().toArray();
    res.send(result);  
})





app.listen(3000, dbConnect) // app.listen( , 콜백함수) => 3000포트 키자마자 콜백함수 실행, 그 후 get등이 실행
// npx nodemon (= npx nodemon index.js)로 실행 // 'http://localhost:3000/' 가서 잘 작동하는지 확인해보삼


/* 
    RDBMS)         MongoDB)
        Database       Database
        Table          Collection
        Tuple/Row      Document
        Column         Field
        Table Join     Embedded Documents
        Primary Key    Primary Key ( Default _id )

*/







