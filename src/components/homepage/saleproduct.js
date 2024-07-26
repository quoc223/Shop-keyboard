
import "./style.scss"

import React from 'react';
function SaleProduct(){
    var items = [
        {
            name:"Keyboard",
            srcimg: "https://i.ibb.co/Rbkb3kN/M1-Banner-1400x510.png",          
        },
        {
            name:"Keycaps",
            srcimg: "https://i.ibb.co/XpZWZxb/akko-clear-keycaps-set-v2-black-01-510x631-1-280x280.png"
        },
        {
            name:"Mouse",
            srcimg:"https://i.ibb.co/GPdSPtg/AKKO-AG325-One-Piece-Zoro-07.png"
        },
        {
            name:"Switch",
            srcimg:"https://i.ibb.co/bN1pnzb/akko-cs-pom-switch-silver-ava-280x280.png"
        },
        {
            name:"Accessories",
            srcimg:"https://i.ibb.co/zQ06P4C/day-cap-custom-AKKO-midnight-ava-280x280.png"
        }
    ]
    return(
        <div className="tagsale">
            {
                items.map((item,i) => (   
                   <div key={i} className="tagimg">
                        <img className="imgsale" alt="" src={item.srcimg} loading="lazy"/>  
                        <h3>{item.name}</h3>
                   </div>
            ))
            } 
        </div>
    )
}

export default SaleProduct;