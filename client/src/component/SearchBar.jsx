import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import '../styles/Search.css'

const config = require('../config.json')

const stateNames = [{"name":"Alabama","abbreviation":"AL"},{"name":"Alaska","abbreviation":"AK"},{"name":"Arizona","abbreviation":"AZ"},{"name":"Arkansas","abbreviation":"AR"},{"name":"California","abbreviation":"CA"},{"name":"Colorado","abbreviation":"CO"},{"name":"Connecticut","abbreviation":"CT"},{"name":"Delaware","abbreviation":"DE"},{"name":"Florida","abbreviation":"FL"},{"name":"Georgia","abbreviation":"GA"},{"name":"Hawaii","abbreviation":"HI"},{"name":"Idaho","abbreviation":"ID"},{"name":"Illinois","abbreviation":"IL"},{"name":"Indiana","abbreviation":"IN"},{"name":"Iowa","abbreviation":"IA"},{"name":"Kansas","abbreviation":"KS"},{"name":"Kentucky","abbreviation":"KY"},{"name":"Louisiana","abbreviation":"LA"},{"name":"Maine","abbreviation":"ME"},{"name":"Maryland","abbreviation":"MD"},{"name":"Massachusetts","abbreviation":"MA"},{"name":"Michigan","abbreviation":"MI"},{"name":"Minnesota","abbreviation":"MN"},{"name":"Mississippi","abbreviation":"MS"},{"name":"Missouri","abbreviation":"MO"},{"name":"Montana","abbreviation":"MT"},{"name":"Nebraska","abbreviation":"NE"},{"name":"Nevada","abbreviation":"NV"},{"name":"New Hampshire","abbreviation":"NH"},{"name":"New Jersey","abbreviation":"NJ"},{"name":"New Mexico","abbreviation":"NM"},{"name":"New York","abbreviation":"NY"},{"name":"North Carolina","abbreviation":"NC"},{"name":"North Dakota","abbreviation":"ND"},{"name":"Ohio","abbreviation":"OH"},{"name":"Oklahoma","abbreviation":"OK"},{"name":"Oregon","abbreviation":"OR"},{"name":"Pennsylvania","abbreviation":"PA"},{"name":"Rhode Island","abbreviation":"RI"},{"name":"South Carolina","abbreviation":"SC"},{"name":"South Dakota","abbreviation":"SD"},{"name":"Tennessee","abbreviation":"TN"},{"name":"Texas","abbreviation":"TX"},{"name":"Utah","abbreviation":"UT"},{"name":"Vermont","abbreviation":"VT"},{"name":"Virginia","abbreviation":"VA"},{"name":"Washington","abbreviation":"WA"},{"name":"West Virginia","abbreviation":"WV"},{"name":"Wisconsin","abbreviation":"WI"},{"name":"Wyoming","abbreviation":"WY"}]


export default function Search(){
    const [business, setBusiness] = useState("");
    const [data, setData] = useState([]);
    const [state,setState] = useState("");
    const [stars,setStars] = useState(0);
    const [reviewCounts, setReviewCounts] = useState(0);
    const [open, setOpen] = useState("");
    const [city, setCity] = useState("");
    const [category, setCategory] = useState("");

    let navigate = useNavigate();

    const fetchDataByName = () => {
        if(business !== undefined && business.length > 0){
            var searchRoutes = `http://${config.server_host}:${config.server_port}/business_search?search_name=${business}`;
            if(state !== ""){
                searchRoutes += `&state=${state}`;
            }
            if(stars > 0){
                searchRoutes += `&stars=${stars}`;
            }
            if(reviewCounts > 0){
                searchRoutes += `&review_count=${reviewCounts}`;
            }
            if(open != ""){
                searchRoutes += `&is_open=${open}`;
            }
            if(city != ""){
                searchRoutes += `&city=${city}`;
            }
            if(category != ""){
                searchRoutes += `&category=${category}`;
            }
            console.log(searchRoutes)
            fetch(searchRoutes)
                .then(res=>res.json())
                .then(resJson=>{
                    if(resJson.data === undefined){
                        console.log("return data length is 0");
                        setData([])
                        return;
                    }
                    console.log(resJson.data);
                    const results = resJson.data;
                    setData(results)
                    navigate(`/search_outcome`,{ state: { "jsonData" : results , "searchRoutes":searchRoutes} });
            });
        } else {
            setData([])
        }
        
    }

    const handleChangeOnBusiness = (value) => {
        console.log("input business name " + value);
        setBusiness(value);
    }

    const handleChangeOnState = (value) => {
        console.log("select state " + value);
        setState(value);
    }

    const handleChangeOnStars = (value) => {
        console.log("select stars " + value);
        var number = Number(value)
        setStars(number);
    }

    const handleChangeOnReviewCounts = (value) => {
        console.log("select review counts " + value);
        var number = Number(value)
        setReviewCounts(number);
    }

    const handleChangeOnOpen = (value) => {
        console.log("select open " + value);
        setOpen(value);
    }

    const handleChangeOnCity = (value) => {
        console.log("input city name " + value);
        setCity(value);
    }

    const handleChangeOnCategory = (value) => {
        console.log("input category name " + value);
        setCategory(value);
    }

    return (
        <div className="SearchBar">
            <div className="search">
                <input type="text" className="searchTerm" placeholder="Business name ..." onChange={(e)=>handleChangeOnBusiness(e.target.value)}></input>
                <button type="submit" className="searchButton" onClick={()=>fetchDataByName()}>
                    <i className="fa fa-search">Search</i>
                </button>
            </div>
            <div className="search1">
                <input type="text" className="searchTerm1" placeholder="City name ..." onChange={(e)=>handleChangeOnCity(e.target.value)}></input>
                <input type="text" className="searchTerm2" placeholder="Category name ..." onChange={(e)=>handleChangeOnCategory(e.target.value)}></input>
            </div>
            <div className="divWithMargin">
                <select className="selectMenu" onChange={(e)=>handleChangeOnState(e.target.value)}>
                    <option value="">All States</option>
                    {
                        stateNames.map((state)=>{
                            var abbrName = state.abbreviation;
                            return (
                                <option value={abbrName}>{abbrName}</option>
                            );
                        })
                    }
                </select>
                <select className="selectMenu1" onChange={(e)=>handleChangeOnStars(e.target.value)}>
                    <option value="0" >All Stars</option>
                    <option value="1" >&gt; 1 stars</option>
                    <option value="2" >&gt; 2 stars</option>
                    <option value="3" >&gt; 3 stars</option>
                    <option value="4" >&gt; 4 stars</option>
                </select>
                <select className="selectMenu2" onChange={(e)=>handleChangeOnReviewCounts(e.target.value)}>
                    <option value="0" >All Review Counts</option>
                    <option value="50" >&gt; 50 review counts</option>
                    <option value="100" >&gt; 100 review counts</option>
                    <option value="500" >&gt; 500 review counts</option>
                    <option value="1000" >&gt; 1000 review counts</option>
                </select>
                <select class="selectMenu3" onChange={(e)=>handleChangeOnOpen(e.target.value)}>
                    <option value="true" >Is Open</option>
                    <option value="false" >Is Closed</option>
                    <option value="" >No Preference</option>
                </select>
            </div>
        </div>
        
    );
}