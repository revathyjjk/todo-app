import { CiSearch } from "react-icons/ci";
import styles from "./search.module.css";
export default function search() {
  return(

  <div className={styles.searchContainer}>
      {/* <span className="search-icon">🔍</span> */}
      <input
        type="text"
        placeholder="Search note.."
        name="search"
        className={styles.searchInput}
      />
       
        <CiSearch className={styles.searchIcon}/>
      {/* <CiSearch className="search-icon"/> */}
    </div>
   
    );
    }