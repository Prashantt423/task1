import axios from 'axios';
import React, { useEffect, useState } from 'react'
import "./module.css"
import Card from './Card';

export default function Module({edges}) {
    const [data,setData] = useState("");
    const [page,setPage] = useState(1);
    const fetchData = async () =>{
        try{
            const res = await axios.get(`https://64307b10d4518cfb0e50e555.mockapi.io/modules?page=${page}&limit=5`);
            console.log(res.data);
            setData(res.data);
        }
        catch(e){
            console.log(e);
        }
    }
   
    const rednerCards = ()=>{
        if(!Boolean(data)){
           return <p>Loading...</p>
        }

       return data?.map((el)=>{
            return(
                <Card  edges={edges} key={el.id} {...el} />
            )
        })
    }
    useEffect(()=>{
        fetchData();
    },[page])
   

  return (
    <div className="module">
        
        <div className="cards">
            {rednerCards()}
            <div className="buttons">
                <div className="btn" onClick={()=>page>1 && setPage(page-1)}>&lt; </div>
                <div className="nums">1 2 3 4 5 6 </div>
                <div className="btn" onClick={()=>{setPage(page+1)}}>&gt;</div>
            </div>
        </div>
    </div>
  )
}
