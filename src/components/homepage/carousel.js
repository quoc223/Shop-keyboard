import "./style.scss"
import {React} from "react"
import Carousel from 'react-material-ui-carousel'
import { Paper } from '@mui/material'
import Banner1 from '../../assets/baner/5075B-Plus-goku-naruto-1400x510.jpg';
import Banner2 from '../../assets/baner/AKKO-3068B-banner-01-1400x510.jpg';
import Banner3 from '../../assets/baner/banner.jpg';
import Banner4 from '../../assets/baner/M1-Banner-1400x510.jpg';
function CarouselLayout(props)
{
    var items = [
        {
            baner: Banner1,          
        },
        {
            baner: Banner2
        },
        {
            baner: Banner3
        },
        {
            baner: Banner4
        }
    ]

    return (
        <Carousel>
            {
                items.map((item, i) => <Item key={i} item={item} /> )
            }
        </Carousel>
    )
}

function Item(props)
{
    return (
        <Paper>
            <img className="imgbaner" alt="Remy Sharp" src={props.item.baner} />  
        </Paper>
    )
}
export default CarouselLayout; 