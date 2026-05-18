import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <footer class="flex flex-col items-center justify-around w-full py-16 text-sm bg-slate-50 text-gray-800/70">
    <img src={assets.logo} alt="" className='mb-4 h-8 md:h-9 invert opacity-80' />
    <p class="mt-4 text-center">Copyright © 2025 <a href="/">NexStay</a>. All rights reservered.</p>
    <div class="flex items-center gap-4 mt-6">
        <a href="#" class="font-medium text-gray-800 hover:text-black transition-all">
            Brand Guidelines
        </a>
        <div class="h-4 w-px bg-black/20"></div>
        <a href="#" class="font-medium text-gray-800 hover:text-black transition-all">
            Trademark Policy
        </a>
    </div>
</footer>
    </div>
  )
}

export default Footer
