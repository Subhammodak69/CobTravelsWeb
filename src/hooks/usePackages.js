import {useCallback,useEffect,useState} from "react";
import {fetchPackages,fetchPackage} from "../api";

const packageDetailPromises = new Map();

function fetchPackageOnce(id) {
  if (!packageDetailPromises.has(id)) {
    packageDetailPromises.set(id, fetchPackage(id));
  }
  return packageDetailPromises.get(id);
}

export default function usePackages(id,filters={}){const[packages,setPackages]=useState([]),[pagination,setPagination]=useState({total:0,page:1,pages:1}),[pack,setPack]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState("");const load=useCallback(async()=>{setLoading(true);try{if(id)setPack(await fetchPackageOnce(id));else{const result=await fetchPackages(filters);setPackages(result.items);setPagination(result)}setError("")}catch(e){setError(e.message)}finally{setLoading(false)}},[id,filters]);useEffect(()=>{load()},[load]);return{packages,pack,pagination,loading,error,reload:load};}
