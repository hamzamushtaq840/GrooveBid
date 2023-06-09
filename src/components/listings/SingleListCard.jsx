import moment from 'moment'
import React, { useEffect, useState } from 'react'
import blank from '../../assets/blank.svg'
import collectible from '../../assets/collectible.svg'
import disc from '../../assets/disc.svg'
import disc2 from '../../assets/disc2.svg'
import dyed from '../../assets/dyed.svg'
import firstRun from '../../assets/firstRun.svg'
import glow from '../../assets/glow.svg'
import grams from '../../assets/grams.svg'
import named from '../../assets/named.svg'
import plastic from '../../assets/plastic.svg'
import ConfirmBid from './ConfirmBid'
import OlderBids from './OlderBids'

const SingleListCard = ({ val }) => {
    const [extra, setExtra] = useState(false)
    const [imageModal, setImageModal] = useState(false);
    const [modal, setModal] = useState(false)
    const [error, setError] = useState(false)
    const [errorText, setErrorText] = useState('')
    const [oldModal, setOldModal] = useState(false)
    const [price, setPrice] = useState(null)
    const [type, setType] = useState(null)
    const [remainingTime, setRemainingTime] = useState(getRemainingTime(val.endDay, val.endTime));

    useEffect(() => {
        const intervalId = setInterval(() => {
            setRemainingTime(getRemainingTime(val.endDay, val.endTime));
        }, 100);
        return () => clearInterval(intervalId);
    }, [val.endDay, val.endTime]);

    function getRemainingTime(endDay, endTime) {
        const endDateTime = moment(`${endDay} ${endTime}`);
        const now = moment();
        const diff = endDateTime.diff(now);
        const duration = moment.duration(diff);
        const years = duration.years();
        const months = duration.months();
        const days = duration.days();
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        let remainingTime;
        if (years > 0) {
            remainingTime = `${years} ${years === 1 ? 'year' : 'years'}`;
        } else if (months > 0) {
            remainingTime = `${months} ${months === 1 ? 'month' : 'months'}`;
        } else if (days > 0) {
            remainingTime = `${days} ${days === 1 ? 'day' : 'days'} ${hours}h`;
        } else if (hours > 0) {
            remainingTime = `${hours}h ${minutes} ${minutes === 1 ? 'min' : 'mins'}`;
        } else if (minutes > 0) {
            remainingTime = `${minutes} ${minutes === 1 ? 'min' : 'mins'}`;
            if (seconds > 0) {
                remainingTime += ` ${seconds} s`;
            }
        } else {
            remainingTime = `${seconds} s`;
        }

        return remainingTime;
    }

    function getMonthAndDate(dateString) {
        const date = moment(dateString);
        const monthName = date.format("MMM");
        const dayOfMonth = date.format("D");
        return `${dayOfMonth} ${monthName}`;
    }

    const handleBid = (e, type) => {
        e.preventDefault()
        console.log(price);
        if (type === 'bid') {
            if (price === null || price === '') {
                setError(true)
                setErrorText('Please enter a price')
                return
            }
            if (price < val.minPrice) {
                setError(true)
                setErrorText('Enter higher price than min')
                return
            }
        }
        setError(false)
        console.log(type);
        type === 'bid' ? setType('bid') : setType('buy')
        setModal(true)
    }

    return (
        <div className={`flex relative mb-[10px] xsm:text-[1.07rem] sm:text-[1.07rem] text-[1.2rem] pb-[8px] card rounded-[8px] bg-[#ffffff] flex-wrap xsm:min-w-[165px] sm:min-w-[165px] md:min-w-[200px] lg:min-w-[210px] xl:min-w-[220px] 2xl:min-w-[240px]  h-[0%] flex-col`}>
            <img src={disc} className=' w-full' alt="" onClick={() => setImageModal(true)} />
            <div onClick={() => setExtra(prev => !prev)} className='flex justify-between cursor-pointer px-[0.625em] pt-[0.425em]'>
                <div className='flex flex-col justify-between'>
                    <div className='flex items-start'>
                        <div className='flex flex-col mr-[0.425em]'>
                            <h1 className='text-[0.75em] font-[700]' >{val.discName}</h1>
                            <h1 className='text-[0.55em] font-[500] mt-[-0.413em] text-[##595959]' >{val.brand}</h1>
                        </div>
                        <span className='px-[0.5em] mt-[2px] text-[0.563em] border-[1px] rounded-full border-[#595959]'>{val.condition}</span>
                    </div>
                    <div className='flex mt-[5px] flex-col  text-[#595959]'>
                        <span className='font-[600] text-[0.6em]'>{getMonthAndDate(val.endDay)} - {val.endTime} </span>
                        <span className='font-[500] text-[#595959BF] text-[0.55em]'>{remainingTime}</span>
                    </div>
                </div>

                <div className='flex flex-col justify-between items-end'>
                    <button className='text-[0.60em] xsm:w-[50px] sm:w-[50px] w-[80px] px-[0.4375em] py-[0.125em] border-[#595959] border-[1px] rounded-[6px]'>Follow</button>

                    <div className='flex flex-col items-end'>
                        <span className='text-[0.75em] mb-[-3px]  font-[600]'>{val.startingPrice} kr</span>
                        {val.priceType === 'fixedPrice' && <span className='text-[0.6em] font-[500] text-[#595959bf]'>Fixed price</span>}
                        {(val.priceType !== 'fixedPrice') &&
                            <div className='flex items-center  text-[1em]'>
                                <p onClick={(e) => { setOldModal(true); e.stopPropagation(); }} className='text-[0.6em] cursor-pointer hover:underline hover:text-text font-[500] text-[#595959BF] '>{val.bids.length} Bids</p>
                            </div>}
                    </div>

                </div>
            </div>
            {extra && <> <div className='mt-[10px] text-[1.3rem] xsm:text-[1rem] sm:text-[1rem] px-[0.625em]'>
                <div className='flex w-full mb-[5px] justify-between gap-[5px] flex-wrap'>

                    {val.plastic !== '' &&
                        <div className='flex items-center gap-[3px]'>
                            <img src={plastic} alt="" className=" w-[0.8125em]" />
                            <p className='text-[0.6em] font-[300]'>{val.plastic}</p>
                        </div>
                    }
                    {val.grams !== '' &&
                        <div className='flex items-center gap-[3px]'>
                            <img src={grams} alt="" className=" w-[0.75em]" />
                            <p className='text-[0.6em] font-[300]'>{val.grams}</p>
                        </div>
                    }
                    {val.named !== false &&
                        <div className='flex items-center gap-[3px]'>
                            <img src={named} alt="" className=" w-[0.625em]" />
                            <p className='text-[0.6em] font-[300]'>Named</p>
                        </div>
                    }
                    {val.dyed !== false &&
                        <div className='flex items-center gap-[3px]'>
                            <img src={dyed} alt="" className=" w-[0.6875em]" />
                            <p className='text-[0.6em] font-[300]'>Dyed</p>
                        </div>
                    }
                    {val.blank !== false &&
                        <div className='flex items-center gap-[3px]'>
                            <img src={blank} alt="" className={` w-[0.625em] ${extra ? "mt-[-0.0625em]" : ""} `} />
                            <p className='text-[0.6em] font-[300]'>Blank</p>
                        </div>
                    }
                    {val.glow !== false &&
                        <div className='flex items-center gap-[3px]'>
                            <img src={glow} alt="" className=" w-[0.75em]" />
                            <p className='text-[0.6em] font-[300]'>Glow</p>
                        </div>
                    }
                    {val.firstRun !== false &&
                        <div className='flex items-center gap-[3px]'>
                            <img src={firstRun} alt="" className=" w-[0.625em]" />
                            <p className='text-[0.6em] font-[300]'>Run</p>
                        </div>
                    }
                    {val.collectible !== false &&
                        <div className='flex items-center gap-[3px]'>
                            <img src={collectible} alt="" className=" w-[0.6875em]" />
                            <p className='text-[0.6em] font-[300]'>Collectible</p>
                        </div>
                    }

                </div>
                {val.priceType === 'auction' &&
                    <form onSubmit={(e) => handleBid(e, 'bid')} className='flex flex-col mb-[6px] gap-[6px]'>
                        <p className='text-[0.55em] text-[#595959] py-[2px] font-[400]'>Buyer pays shipping from, <span className='font-[700]'>Uppsala, Sweden</span></p>
                        <input value={price} min={0} onChange={(e) => {
                            setPrice(e.target.value);
                            if (Number(e.target.value >= val.minPrice))
                                setError(false)
                            if (e.target.value && errorText === 'Please enter a price') {
                                setErrorText('')
                                setError(false)
                            }
                            if (e.target.value && errorText === 'Enter higher price than min') {
                                setErrorText('')
                                setError(false)
                            }
                        }} type="number" className={`w-full pl-[3px] py-[0.25em] rounded-[2px] text-[.65em] border-[1px]  ${error ? "border-[#f21616]" : "border-[#000000]"}`} placeholder={`Min Price - ${val.minPrice} kr`} />
                        {error && <p className='text-[0.5em] text-[#eb0000] my-[-5px]'>{errorText}</p>}
                        <button type='submit' className='py-[0.25em] w-full rounded-[2px] text-[.75em] bg-primary font-[600] text-[#ffffff] button'>Place Bid</button>
                    </form>}
                {val.priceType === 'fixedPrice' &&
                    <div className='flex mb-[5px] flex-col gap-[5px] mt-[5px]'>
                        <p className='text-[0.55em] text-[#595959] py-[3px] font-[400]'>Buyer pays shipping from, <span className='font-[700]'>Uppsala, Sweden</span></p>
                        <button onClick={(e) => { handleBid(e, 'buy') }} className='py-[0.25em] w-full rounded-[2px] text-[.75em] bg-primary font-[600] text-[#ffffff] button'>Buy</button>
                    </div>}
            </div>
            </>
            }
            {imageModal && (
                <div onClick={() => setImageModal(false)} className="fixed  bg-[#000000CC] z-50 top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center">
                    <div className="w-[50%] xsm:w-full sm:w-full max-h-[80%]">
                        <img onClick={(e) => e.stopPropagation()} src={disc2} alt="" className="w-full object-contain" />
                    </div>
                </div>
            )}
            {modal && <ConfirmBid price={price} val={val} type={type} setModel={setModal} />}
            {oldModal && <OlderBids setModel={setOldModal} />}
        </div >
    )
}

export default SingleListCard