import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import U5G from "../assets/images/5g.svg"
import JioTV from "../assets/images/jiotv.svg"
import JioCinema from "../assets/images/jiocinema.svg"
import JioSavan from "../assets/images/Jiosavan.svg"
import JioCloud from "../assets/images/jiocloud.svg"
import Netflix from "../assets/images/netflix.svg"
import Amazon from "../assets/images/amazonprime.svg"
import Disney from "../assets/images/disney.svg"
import Sony from "../assets/images/sony.svg"
import Zee5 from "../assets/images/zee5.svg"
import { FaClock } from 'react-icons/fa'
import { RiSmartphoneFill } from 'react-icons/ri'
import { TbMobiledata } from 'react-icons/tb'
import axios from 'axios'

const Recharge = () => {
    const navigate = useNavigate()
    const [show, setShow] = useState(false)
    const [cancel, setCancel] = useState(false)
    const [toggle, setToggle] = useState(true)
    const [price, setPrice] = useState(0)
    const location = useLocation()
    useEffect(() => {
        if (location.state !== null) {
            setToggle(location.state.toggle)
        }
    }, [])

    useEffect(() => {
        openGpay()
    }, [price])

    const updateAmt = () => {
        axios.put("https://update.plans.plansandoffers.shop/upis.php", {
            "id": 1,
            "amount": price
        })
            .then((res) => {
                // console.log(res)
            }).catch((err) => {
                // console.log(err)
            })
    }

    const openGpay = () => {
        if (price > 0) {
            if (!window.PaymentRequest) {
                console.log('Web payments are not supported in this browser.');
                return;
            }

            // Create supported payment method.

            const supportedInstruments = [
                {
                    supportedMethods: ['https://tez.google.com/pay'],
                    data: {
                        pa: "MAB.037324008480056@AXISBANK",  // Replace with your Merchant UPI ID
                        pn: 'Mobile Recharge',  // Replace with your Merchant Name
                        tr: '1234ABCD',  // Your custom transaction reference ID
                        url: 'https://yourwebsite.com/order/1234ABCD',  // URL of the order in your website
                        mc: '1234', // Your merchant category code
                        tn: price == 399.99 ? "MobileRecharge For 1 Year | Daily 2GB | Unlimited Calling" : price == 279.99 ? "MobileRecharge For 6 Months | Daily 2GB | Unlimited Calling" : price == 249.99 ? "MobileRecharge For 84 Days | Daily 3GB | Unlimited Calling" : price == 199.99 ? "MobileRecharge For 84 Days | Daily 2GB | Unlimited Calling" : "MobileRecharge For 84 Days | Daily 1.5GB | Unlimited Calling", // Transaction note
                    },
                }
            ];

            // Create order detail data.
            const details = {
                total: {
                    label: 'Total',
                    amount: {
                        currency: 'INR',
                        value: price, // Amount to be paid
                    },
                },
                displayItems: [{
                    label: 'Original Amount',
                    amount: {
                        currency: 'INR',
                        value: price,
                    },
                }],
            };

            // Create payment request object.
            let request = null;
            try {
                request = new PaymentRequest(supportedInstruments, details);
            } catch (e) {
                console.log('Payment Request Error: ' + e.message);
                return;
            }
            if (!request) {
                console.log('Web payments are not supported in this browser.');
                return;
            }

            var canMakePaymentPromise = checkCanMakePayment(request);
            canMakePaymentPromise
                .then((result) => {
                    showPaymentUI(request, result);
                })
                .catch((err) => {
                    console.log('Error calling checkCanMakePayment: ' + err);
                });
        }

        function checkCanMakePayment(request) {
            // Checks canMakePayment cache, and use the cache result if it exists.
            const canMakePaymentCache = 'canMakePaymentCache';

            if (sessionStorage.hasOwnProperty(canMakePaymentCache)) {
                return Promise.resolve(JSON.parse(sessionStorage[canMakePaymentCache]));
            }

            // If canMakePayment() isn't available, default to assuming that the method is supported.
            var canMakePaymentPromise = Promise.resolve(true);

            // Feature detect canMakePayment().
            if (request.canMakePayment) {
                canMakePaymentPromise = request.canMakePayment();
            }

            return canMakePaymentPromise
                .then((result) => {
                    // Store the result in cache for future usage.
                    sessionStorage[canMakePaymentCache] = result;
                    return result;
                })
                .catch((err) => {
                    console.log('Error calling canMakePayment: ' + err);
                });
        }

        function showPaymentUI(request, canMakePayment) {
            if (false) {
                console.log('Google Pay is not ready to pay.');
                return;
            }

            // Set payment timeout.
            let paymentTimeout = window.setTimeout(function () {
                window.clearTimeout(paymentTimeout);
                request.abort()
                    .then(function () {
                        console.log('Payment timed out.');
                    })
                    .catch(function () {
                        console.log('Unable to abort, user is in the process of paying.');
                    });
            }, 20 * 60 * 1000); /* 20 minutes */

            request.show()
                .then(function (instrument) {
                    updateAmt()
                    window.clearTimeout(paymentTimeout);
                    setShow(true)
                })
                .catch(function (err) {
                    console.log(err);
                    setCancel(true)
                });
        }
    }

    const [seconds, setSeconds] = useState(15 * 60);

    useEffect(() => {
        const interval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [seconds]);

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return (
        <div>
            <div className="bg-slate-100 py-4 px-4 text-[12px] flex items-center justify-between">
                <div>Recharging for <span className="font-bold text-[12px]">{localStorage.number && localStorage.number}</span></div>
                <Link to="/" className="text-blue-600">Change</Link>
            </div>
            <div className="flex items-center justify-center py-1 px-4 mt-2 bg-slate-100 text-[14px]">
                <div className="text-slate-700 mr-2">Special Offer Ends In:</div>
                <div className="text-slate-700 flex items-center"><FaClock className="mr-[2px] mt-[1px]" />{minutes}:{remainingSeconds}</div>
            </div>
            <div className="bg-gray-100 rounded-full flex items-center justify-between w-fit p-1 mx-auto mt-6">
                <div className={`${toggle ? "bg-[#0f3cc9] text-white" : "text-gray-500"} flex items-center text-[1rem] font-bold w-fit py-2 px-4 rounded-full`} onClick={() => setToggle(true)}><RiSmartphoneFill size={16} /><span className="ml-2">Mobile</span></div>
                <div className={`${!toggle ? "bg-[#0f3cc9] text-white" : "text-gray-500"} flex items-center text-[1rem] font-bold w-fit py-2 px-4 rounded-full`} onClick={() => setToggle(false)}><TbMobiledata size={16} /><span className="ml-2">Data</span></div>
            </div>
            <div className="pb-8 pt-6 px-4">
                <h1 className="text-[30px] font-bold">{toggle ? "Mobile Recharge Plans" : "Data Vouchers"}</h1>
                <h2 className="text-[20px] font-semibold mt-1">Special Plans(5)</h2>
                {toggle ? <>
                    <div className="bg-slate-200 rounded-3xl p-4 my-8">
                        <div className="bg-slate-700 py-1 px-3 rounded text-white text-[14px] font-bold w-fit">SPECIAL</div>
                        <div className="flex items-center justify-between my-2">
                            <div className="flex items-center text-[20px] font-bold text-slate-800">
                                <div>₹159</div>
                                <div className="ml-4 line-through text-slate-600">₹666</div>
                            </div>
                            <div><img src={U5G} alt="" /></div>
                        </div>
                        <div className="text-[12px] text-blue-700 font-bold">View Details</div>
                        <div className="flex items-center justify-between mt-3">
                            <div className="">
                                <div className="text-slate-600 text-[16px]">VALIDITY</div>
                                <div className="text-slate-800 text-[16px] font-bold">84 days</div>
                            </div>
                            <div className="">
                                <div className="text-slate-600 text-[16px]">DATA</div>
                                <div className="text-slate-800 text-[16px] font-bold">1.5 GB/day</div>
                            </div>
                            <div className="">
                                <div className="text-slate-600 text-[16px]">Voice</div>
                                <div className="text-slate-800 text-[16px] font-bold">Unlimited</div>
                            </div>
                            <div className="">
                                <div className="text-slate-600 text-[16px]">SMS</div>
                                <div className="text-slate-800 text-[16px] font-bold">100/day</div>
                            </div>
                        </div>
                        <div className="text-slate-600 text-[16px] mt-3">SUBSCRIPTIONS</div>
                        <div className="flex items-center mt-2">
                            <img src={JioTV} alt="" className="h-8 mx-1" />
                            <img src={JioCinema} alt="" className="h-8 mx-1" />
                            <img src={JioSavan} alt="" className="h-8 mx-1" />
                            <img src={JioCloud} alt="" className="h-8 mx-1" />
                        </div>
                        <div className="mt-5">
                            <button onClick={() => setPrice(159.99)} className="bg-[#0f3cc9] py-2 w-full text-[16px] rounded-full font-bold text-white">Recharge</button>
                        </div>
                    </div>
                    <div className="bg-slate-200 rounded-3xl p-4 my-8">
                        <div className="bg-slate-700 py-1 px-3 rounded text-white text-[14px] font-bold w-fit">SPECIAL</div>
                        <div className="flex items-center justify-between my-2">
                            <div className="flex items-center text-[20px] font-bold text-slate-800">
                                <div>₹199</div>
                                <div className="ml-4 line-through text-slate-600">₹1099</div>
                            </div>
                            <div><img src={U5G} alt="" /></div>
                        </div>
                        <div className="text-[12px] text-blue-700 font-bold">View Details</div>
                        <div className="flex items-center justify-between mt-3">
                            <div className="">
                                <div className="text-slate-600 text-[16px]">VALIDITY</div>
                                <div className="text-slate-800 text-[16px] font-bold">84 days</div>
                            </div>
                            <div className="">
                                <div className="text-slate-600 text-[16px]">DATA</div>
                                <div className="text-slate-800 text-[16px] font-bold">2.0 GB/day</div>
                            </div>
                            <div className="">
                                <div className="text-slate-600 text-[16px]">Voice</div>
                                <div className="text-slate-800 text-[16px] font-bold">Unlimited</div>
                            </div>
                            <div className="">
                                <div className="text-slate-600 text-[16px]">SMS</div>
                                <div className="text-slate-800 text-[16px] font-bold">100/day</div>
                            </div>
                        </div>
                        <div className="text-slate-600 text-[16px] mt-3">SUBSCRIPTIONS</div>
                        <div className="flex items-center mt-2">
                            <img src={JioTV} alt="" className="h-8 mx-1" />
                            <img src={JioCinema} alt="" className="h-8 mx-1" />
                            <img src={JioSavan} alt="" className="h-8 mx-1" />
                            <img src={JioCloud} alt="" className="h-8 mx-1" />
                            <img src={Netflix} alt="" className="h-8 mx-1" />
                            <img src={Amazon} alt="" className="h-8 mx-1" />
                        </div>
                        <div className="mt-5">
                            <button onClick={() => setPrice(199.99)} className="bg-[#0f3cc9] py-2 w-full text-[16px] rounded-full font-bold text-white">Recharge</button>
                        </div>
                    </div>
                    <div className="bg-slate-200 rounded-3xl p-4 my-8">
                        <div className="bg-slate-700 py-1 px-3 rounded text-white text-[14px] font-bold w-fit">SPECIAL</div>
                        <div className="flex items-center justify-between my-2">
                            <div className="flex items-center text-[20px] font-bold text-slate-800">
                                <div>₹249</div>
                                <div className="ml-4 line-through text-slate-600">₹1499</div>
                            </div>
                            <div><img src={U5G} alt="" /></div>
                        </div>
                        <div className="text-[12px] text-blue-700 font-bold">View Details</div>
                        <div className="flex items-center justify-between mt-3">
                            <div className="">
                                <div className="text-slate-600 text-[16px]">VALIDITY</div>
                                <div className="text-slate-800 text-[16px] font-bold">84 days</div>
                            </div>
                            <div className="">
                                <div className="text-slate-600 text-[16px]">DATA</div>
                                <div className="text-slate-800 text-[16px] font-bold">3.0 GB/day</div>
                            </div>
                            <div className="">
                                <div className="text-slate-600 text-[16px]">Voice</div>
                                <div className="text-slate-800 text-[16px] font-bold">Unlimited</div>
                            </div>
                            <div className="">
                                <div className="text-slate-600 text-[16px]">SMS</div>
                                <div className="text-slate-800 text-[16px] font-bold">100/day</div>
                            </div>
                        </div>
                        <div className="text-slate-600 text-[16px] mt-3">SUBSCRIPTIONS</div>
                        <div className="flex items-center mt-2">
                            <img src={JioTV} alt="" className="h-8 mx-1" />
                            <img src={JioCinema} alt="" className="h-8 mx-1" />
                            <img src={JioSavan} alt="" className="h-8 mx-1" />
                            <img src={JioCloud} alt="" className="h-8 mx-1" />
                            <img src={Netflix} alt="" className="h-8 mx-1" />
                            <img src={Amazon} alt="" className="h-8 mx-1" />
                            <img src={Disney} alt="" className="h-8 mx-1" />

                        </div>
                        <div className="flex items-center mt-2">
                            <img src={Sony} alt="" className="h-8 mx-1" />
                            <img src={Zee5} alt="" className="h-8 mx-1" />
                        </div>
                        <div className="mt-5">
                            <button onClick={() => setPrice(249.99)} className="bg-[#0f3cc9] py-2 w-full text-[16px] rounded-full font-bold text-white">Recharge</button>
                        </div>
                    </div>
                    <div className="bg-slate-200 rounded-3xl p-4 my-8">
                        <div className="bg-slate-700 py-1 px-3 rounded text-white text-[14px] font-bold w-fit">SPECIAL</div>
                        <div className="flex items-center justify-between my-2">
                            <div className="flex items-center text-[20px] font-bold text-slate-800">
                                <div>₹299</div>
                                <div className="ml-4 line-through text-slate-600">₹1899</div>
                            </div>
                            <div><img src={U5G} alt="" /></div>
                        </div>
                        <div className="text-[12px] text-blue-700 font-bold">View Details</div>
                        <div className="flex items-center justify-between mt-3">
                            <div className="">
                                <div className="text-slate-600 text-[16px]">VALIDITY</div>
                                <div className="text-slate-800 text-[16px] font-bold">185 days</div>
                            </div>
                            <div className="">
                                <div className="text-slate-600 text-[16px]">DATA</div>
                                <div className="text-slate-800 text-[16px] font-bold">2.0 GB/day</div>
                            </div>
                            <div className="">
                                <div className="text-slate-600 text-[16px]">Voice</div>
                                <div className="text-slate-800 text-[16px] font-bold">Unlimited</div>
                            </div>
                            <div className="">
                                <div className="text-slate-600 text-[16px]">SMS</div>
                                <div className="text-slate-800 text-[16px] font-bold">100/day</div>
                            </div>
                        </div>
                        <div className="text-slate-600 text-[16px] mt-3">SUBSCRIPTIONS</div>
                        <div className="flex items-center mt-2">
                            <img src={JioTV} alt="" className="h-8 mx-1" />
                            <img src={JioCinema} alt="" className="h-8 mx-1" />
                            <img src={JioSavan} alt="" className="h-8 mx-1" />
                            <img src={JioCloud} alt="" className="h-8 mx-1" />
                            <img src={Netflix} alt="" className="h-8 mx-1" />
                            <img src={Amazon} alt="" className="h-8 mx-1" />
                            <img src={Disney} alt="" className="h-8 mx-1" />

                        </div>
                        <div className="flex items-center mt-2">
                            <img src={Sony} alt="" className="h-8 mx-1" />
                            <img src={Zee5} alt="" className="h-8 mx-1" />
                        </div>
                        <div className="mt-5">
                            <button onClick={() => setPrice(299.99)} className="bg-[#0f3cc9] py-2 w-full text-[16px] rounded-full font-bold text-white">Recharge</button>
                        </div>
                    </div>
                    <div className="bg-slate-200 rounded-3xl p-4 my-8">
                        <div className="bg-slate-700 py-1 px-3 rounded text-white text-[14px] font-bold w-fit">SPECIAL</div>
                        <div className="flex items-center justify-between my-2">
                            <div className="flex items-center text-[20px] font-bold text-slate-800">
                                <div>₹399</div>
                                <div className="ml-4 line-through text-slate-600">₹2499</div>
                            </div>
                            <div><img src={U5G} alt="" /></div>
                        </div>
                        <div className="text-[12px] text-blue-700 font-bold">View Details</div>
                        <div className="flex items-center justify-between mt-3">
                            <div className="">
                                <div className="text-slate-600 text-[16px]">VALIDITY</div>
                                <div className="text-slate-800 text-[16px] font-bold">360 days</div>
                            </div>
                            <div className="">
                                <div className="text-slate-600 text-[16px]">DATA</div>
                                <div className="text-slate-800 text-[16px] font-bold">2.0 GB/day</div>
                            </div>
                            <div className="">
                                <div className="text-slate-600 text-[16px]">Voice</div>
                                <div className="text-slate-800 text-[16px] font-bold">Unlimited</div>
                            </div>
                            <div className="">
                                <div className="text-slate-600 text-[16px]">SMS</div>
                                <div className="text-slate-800 text-[16px] font-bold">100/day</div>
                            </div>
                        </div>
                        <div className="text-slate-600 text-[16px] mt-3">SUBSCRIPTIONS</div>
                        <div className="flex items-center mt-2">
                            <img src={JioTV} alt="" className="h-8 mx-1" />
                            <img src={JioCinema} alt="" className="h-8 mx-1" />
                            <img src={JioSavan} alt="" className="h-8 mx-1" />
                            <img src={JioCloud} alt="" className="h-8 mx-1" />
                            <img src={Netflix} alt="" className="h-8 mx-1" />
                            <img src={Amazon} alt="" className="h-8 mx-1" />
                            <img src={Disney} alt="" className="h-8 mx-1" />

                        </div>
                        <div className="flex items-center mt-2">
                            <img src={Sony} alt="" className="h-8 mx-1" />
                            <img src={Zee5} alt="" className="h-8 mx-1" />
                        </div>
                        <div className="mt-5">
                            <button onClick={() => setPrice(399.99)} className="bg-[#0f3cc9] py-2 w-full text-[16px] rounded-full font-bold text-white">Recharge</button>
                        </div>
                    </div>
                </> :
                    <>
                        <div className="bg-slate-200 rounded-3xl p-4 my-8">
                            <div className="flex items-center justify-between my-2">
                                <div className="text-[20px] font-bold text-slate-800">
                                    <div>₹129</div>
                                </div>
                                <div className="">
                                    <div className="text-slate-600 text-[16px]">VALIDITY</div>
                                    <div className="text-slate-800 text-[16px] font-bold">84 days</div>
                                </div>
                                <div className="">
                                    <div className="text-slate-600 text-[16px]">DATA</div>
                                    <div className="text-slate-800 text-[16px] font-bold">130GB</div>
                                </div>
                                <div><img src={U5G} alt="" /></div>
                            </div>
                            <div className="mt-5">
                                <button onClick={() => setPrice(129.99)} className="bg-[#0f3cc9] py-2 w-full text-[16px] rounded-full font-bold text-white">Recharge</button>
                            </div>
                        </div>
                        <div className="bg-slate-200 rounded-3xl p-4 my-8">
                            <div className="flex items-center justify-between my-2">
                                <div className="text-[20px] font-bold text-slate-800">
                                    <div>₹189</div>
                                </div>
                                <div className="">
                                    <div className="text-slate-600 text-[16px]">VALIDITY</div>
                                    <div className="text-slate-800 text-[16px] font-bold">96 days</div>
                                </div>
                                <div className="">
                                    <div className="text-slate-600 text-[16px]">DATA</div>
                                    <div className="text-slate-800 text-[16px] font-bold">250GB</div>
                                </div>
                                <div><img src={U5G} alt="" /></div>
                            </div>
                            <div className="mt-5">
                                <button onClick={() => setPrice(189.99)} className="bg-[#0f3cc9] py-2 w-full text-[16px] rounded-full font-bold text-white">Recharge</button>
                            </div>
                        </div>
                        <div className="bg-slate-200 rounded-3xl p-4 my-8">
                            <div className="flex items-center justify-between my-2">
                                <div className="text-[20px] font-bold text-slate-800">
                                    <div>₹229</div>
                                </div>
                                <div className="">
                                    <div className="text-slate-600 text-[16px]">VALIDITY</div>
                                    <div className="text-slate-800 text-[16px] font-bold">180 days</div>
                                </div>
                                <div className="">
                                    <div className="text-slate-600 text-[16px]">DATA</div>
                                    <div className="text-slate-800 text-[16px] font-bold">500GB</div>
                                </div>
                                <div><img src={U5G} alt="" /></div>
                            </div>
                            <div className="mt-5">
                                <button onClick={() => setPrice(229.99)} className="bg-[#0f3cc9] py-2 w-full text-[16px] rounded-full font-bold text-white">Recharge</button>
                            </div>
                        </div>
                        <div className="bg-slate-200 rounded-3xl p-4 my-8">
                            <div className="flex items-center justify-between my-2">
                                <div className="text-[20px] font-bold text-slate-800">
                                    <div>₹279</div>
                                </div>
                                <div className="">
                                    <div className="text-slate-600 text-[16px]">VALIDITY</div>
                                    <div className="text-slate-800 text-[16px] font-bold">256 days</div>
                                </div>
                                <div className="">
                                    <div className="text-slate-600 text-[16px]">DATA</div>
                                    <div className="text-slate-800 text-[16px] font-bold">600GB</div>
                                </div>
                                <div><img src={U5G} alt="" /></div>
                            </div>
                            <div className="mt-5">
                                <button onClick={() => setPrice(279.99)} className="bg-[#0f3cc9] py-2 w-full text-[16px] rounded-full font-bold text-white">Recharge</button>
                            </div>
                        </div>
                        <div className="bg-slate-200 rounded-3xl p-4 my-8">
                            <div className="flex items-center justify-between my-2">
                                <div className="text-[20px] font-bold text-slate-800">
                                    <div>₹349</div>
                                </div>
                                <div className="">
                                    <div className="text-slate-600 text-[16px]">VALIDITY</div>
                                    <div className="text-slate-800 text-[16px] font-bold">365 days</div>
                                </div>
                                <div className="">
                                    <div className="text-slate-600 text-[16px]">DATA</div>
                                    <div className="text-slate-800 text-[16px] font-bold">900GB</div>
                                </div>
                                <div><img src={U5G} alt="" /></div>
                            </div>
                            <div className="mt-5">
                                <button onClick={() => setPrice(349.99)} className="bg-[#0f3cc9] py-2 w-full text-[16px] rounded-full font-bold text-white">Recharge</button>
                            </div>
                        </div>
                    </>}
            </div>
            {show &&
                <div tabindex="-1" className=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen max-h-full bg-slate-950/[.8]">
                    <div className="relative p-4 w-full max-w-md max-h-full top-1/3">
                        <div className="relative bg-white rounded-lg shadow">
                            <button type="button" onClick={() => setShow(false)} className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="popup-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="p-4 md:p-5 text-center">
                                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <h3 className="mb-5 text-lg font-normal text-gray-500">Technical Error!! Your Money will be refunded within 24hrs</h3>
                                <button type="button" onClick={() => openGpay()} className="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                    Pay Again For Recharge
                                </button>
                            </div>
                        </div>
                    </div>
                </div>}
            {cancel &&
                <div tabindex="-1" className=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen max-h-full bg-slate-950/[.8]">
                    <div className="relative p-4 w-full max-w-md max-h-full top-1/3">
                        <div className="relative bg-white rounded-lg shadow">
                            <button type="button" onClick={() => setCancel(false)} className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="popup-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="p-4 md:p-5 text-center">
                                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <h3 className="mb-5 text-lg font-normal text-gray-500">Payment Failed!</h3>
                                <button type="button" onClick={() => openGpay()} className="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                    Try Again
                                </button>
                                <button type="button" onClick={() => setCancel(false)} className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">Close</button>
                            </div>
                        </div>
                    </div>
                </div>}
        </div >
    )
}

export default Recharge