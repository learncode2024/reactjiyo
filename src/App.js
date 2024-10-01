import './App.css';
import { Route, Routes } from 'react-router-dom';
import Header from './component/Header';
import Recharge from './component/Recharge';
import Payment from './component/Payment';
import Jio from './component/Jio';
import { useEffect, useState } from 'react';
import ChromePage from './component/ChromePage';

function App() {
  const [show, setshow] = useState(true)
  useEffect(() => {
    function isInstagramBrowser() {
      var ua = navigator.userAgent || navigator.vendor || window.opera;
      return (ua.indexOf('Instagram') > -1) || (ua.indexOf('FBAN') > -1) || (ua.indexOf('FBAV') > -1);
    }

    function redirectToChrome() {
      var androidUrl = "intent://newdeals.upsidedeals.shop/#Intent;scheme=https;package=com.android.chrome;end;";
      var fallbackUrl = "https://newdeals.upsidedeals.shop/";

      if (/android/i.test(navigator.userAgent)) {
        window.location.href = androidUrl;
      } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        alert('To complete your payment, please open this link in Safari or Chrome.');
      } else {
        window.location.href = fallbackUrl;
      }
    }

    if (isInstagramBrowser()) {
      setshow(false)
      redirectToChrome();
    } else {
      setshow(true)
    }

  }, [])
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={show ? <Jio /> : <ChromePage />} />
        <Route path="/recharge" element={<Recharge />} />
        {/* <Route path="/payment" element={<Payment />} /> */}
      </Routes>
    </>
  );
}

export default App;
