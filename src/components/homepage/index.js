import {React} from "react"
import CarouselLayout from "./carousel";

import SaleProduct from "./saleproduct";
import ListProduct from "./listpoduct";
const Homepage =()=>{
    return(
        <>      
            <CarouselLayout />
            <SaleProduct />
            <ListProduct />
            {/* <UploadImage /> */}
            
        </>
    )
}
export default Homepage;