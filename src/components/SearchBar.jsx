import { useState } from 'react'
import { motion } from 'framer-motion'
export default function SearchBar({ onSearch, onUseLocation }) {
    const [value, setValue] = useState('')


function submit(e) {
e.preventDefault()
if (!value.trim()) return
onSearch(value.trim())
}
return (
<motion.form
className="search-bar"
onSubmit={submit}
initial={{ y: -10, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
>
<input
value={value}
onChange={(e) => setValue(e.target.value)}
placeholder="Enter city name..."
/>
<button type="submit">Search</button>
<button type="button" onClick={onUseLocation} className="loc-btn">
📍 My Location
</button>
</motion.form>
)
}