import {useEffect,useState} from "react";
import PackageCard from "../components/PackageCard";
import usePackages from "../hooks/usePackages";
import { useTravel } from "../contexts/TravelContext";
import useScrollReveal from "../hooks/useScrollReveal";

// Real Unsplash hero — beautiful Indian landscape (Dal Lake / Kashmir valley)
const HERO_IMG = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=90";

export default function HomePage() {
  const [filters,setFilters]=useState({page:1,page_size:12,search:"",destination:"",type:"",season:"",is_featured:"",min_price:"",max_price:"",sort_by:"created_at",sort_order:"desc"});
  const [searchInput,setSearchInput]=useState("");
  const { packages,pagination,loading,error } = usePackages(undefined,filters);
  const { isMember } = useTravel();
  const revealRef = useScrollReveal();
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(current => current.search === searchInput ? current : {...current, search: searchInput, page: 1});
    }, 450);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const heroImage = packages[0]?.image || HERO_IMG;
  const heroStyle = {
    backgroundImage: `linear-gradient(100deg, rgba(7,36,33,.88) 0%, rgba(13,59,54,.58) 55%, rgba(7,36,33,.18) 100%), url(${heroImage})`,
    backgroundPosition: "center 40%",
    backgroundSize: "cover",
  };

  return (
    <div ref={revealRef}>
      <section className="homeHero" style={heroStyle}>
        <div className="aurora one" />
        <div className="aurora two" />
        <div className="heroCopy">
          <p className="eyebrow">Since 1994 · Guided group journeys</p>
          <h1>Go further.<br /><em>Feel more.</em></h1>
          <p className="intro">Thoughtful journeys across India and beyond, paced for the moments you will remember.</p>
          <label className="heroSearch">
            <span>⌕</span>
            <input value={searchInput} onChange={e=>setSearchInput(e.target.value)} placeholder="Search destinations or journeys..." aria-label="Search destinations or journeys" />
          </label>
          <a href="#journeys" className="explore">Explore journeys <span>↓</span></a>
        </div>
        <div className="heroStamp">
          <span>curated with</span>
          <b>heart</b>
          <i>✦</i>
        </div>
      </section>

      <section className="trust">
        <span>Handpicked stays</span><i>✦</i>
        <span>Small group feeling</span><i>✦</i>
        <span>Always-on support</span><i>✦</i>
        <span>Memories, not checklists</span>
      </section>

      <section id="journeys" className="journeySection reveal" data-reveal>
        <div className="sectionHead">
          <div>
            <p className="eyebrow">Find your next story</p>
            <h2>Journeys that stay<br />with you.</h2>
          </div>
          <p>{isMember ? "Welcome back. Your next escape is waiting." : "Choose a place. We'll take care of the rest."}</p>
        </div>
        <div className="catalogToolbar">
          <input className="catalogInput" value={filters.destination} onChange={e=>setFilters(f=>({...f,destination:e.target.value,page:1}))} placeholder="Destination" aria-label="Filter destination" />
          <select className="catalogSelect" value={filters.type} onChange={e=>setFilters(f=>({...f,type:e.target.value,page:1}))} aria-label="Filter tour type">
            <option value="">All types</option><option value="DOMESTIC">Domestic</option><option value="INTERNATIONAL">International</option>
          </select>
          <select className="catalogSelect" value={filters.season} onChange={e=>setFilters(f=>({...f,season:e.target.value,page:1}))} aria-label="Filter season">
            <option value="">All seasons</option><option value="Spring">Spring</option><option value="Summer">Summer</option><option value="Autumn">Autumn</option><option value="Winter">Winter</option>
          </select>
          <select className="catalogSelect" value={filters.sort_by+"|"+filters.sort_order} onChange={e=>{const [sort_by,sort_order]=e.target.value.split("|");setFilters(f=>({...f,sort_by,sort_order,page:1}))}} aria-label="Sort tours">
            <option value="created_at|desc">Newest</option><option value="title|asc">Title A–Z</option><option value="destination|asc">Destination A–Z</option><option value="starting_price|asc">Price low to high</option><option value="starting_price|desc">Price high to low</option><option value="updated_at|desc">Recently updated</option>
          </select>
          <label className="featuredFilter"><input type="checkbox" checked={filters.is_featured==="true"} onChange={e=>setFilters(f=>({...f,is_featured:e.target.checked?"true":"",page:1}))}/> Featured</label>
        </div>
        <div className="catalogMeta"><span>{loading?"Finding journeys…":error?error:"Showing "+packages.length+" of "+pagination.total+" journeys"}</span><button className="catalogReset" onClick={()=>{setSearchInput("");setFilters({page:1,page_size:12,search:"",destination:"",type:"",season:"",is_featured:"",min_price:"",max_price:"",sort_by:"created_at",sort_order:"desc"})}}>Reset</button></div>
        <div className="packageGrid">
          {packages.map((pack, index) => <PackageCard key={pack.id} pack={pack} index={index} />)}
        </div>
        {!loading && !error && packages.length===0 && <div className="profileLocked"><p>No journeys match these filters.</p></div>}
        {pagination.pages>1&&<div className="catalogPagination"><button disabled={filters.page<=1} onClick={()=>setFilters(f=>({...f,page:f.page-1}))}>← Previous</button><span>Page {filters.page} of {pagination.pages}</span><button disabled={filters.page>=pagination.pages} onClick={()=>setFilters(f=>({...f,page:f.page+1}))}>Next →</button></div>}
      </section>

      <section id="story" className="story reveal" data-reveal>
        <div className="storyImg">
          <img
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=85"
            alt="India travel — Taj Mahal at sunrise"
          />
          <span className="storyImgTag">Since 1994 · Cooch Behar</span>
        </div>
        <div className="storyBody">
          <p className="eyebrow">A little bit about us</p>
          <h2>Travel should change<br />the way you <em>feel.</em></h2>
          <p>For over three decades, we've made travel personal. Our team starts with a good route, then leaves room for the kind of unplanned moments that make a trip yours.</p>
          <div className="storyPills">
            <span className="storyPill">✦ 30+ Years of journeys</span>
            <span className="storyPill">✦ 5,000+ Happy travellers</span>
            <span className="storyPill">✦ 12+ Destinations</span>
          </div>
        </div>
      </section>

    </div>
  );
}
