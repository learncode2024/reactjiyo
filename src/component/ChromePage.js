import React from 'react'
import Chrome from "../assets/images/chromelogo.png"

const ChromePage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div>
        <img src={Chrome} alt='' className="h-20 mx-auto mb-4" />
        <a href="intent://newdeals.upsidedeals.shop/#Intent;scheme=https;package=com.android.chrome;end;"
          className="py-2 px-4 bg-blue-500 rounded-lg text-white font-semibold mt-2">Open In Chrome</a>
      </div>

    </div>
  )
}

export default ChromePage