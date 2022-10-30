import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'

import './profile.css'
import { DiJsBadge } from 'react-icons/di'
import { RiEdit2Fill } from 'react-icons/ri'
import { BsTelephone } from 'react-icons/bs'
import { MdOutlineEmail } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import { useDb } from '../../../contexts/Database'
import Nav from '../components/nav/Nav'
import Profileblank from '../../../assets/avatars/Profile-PNG-File.png'
import TimeSpent from '../../system/orders/TimeSpent'

const Profile = () => {
    const { user } = useAuth()
    const { userOrders } = useDb()
    const page = "profile"
    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)
    const navigate = useNavigate()
    const [timeSpent, setTimeSpent] = useState()
    const [orderTotal, setOrderTotal] = useState(0)
    const [openExis, setOpenExis] = useState(false)


    const onSetTimeSpent = (time) => {
        setTimeSpent(time)
    }

    // the required distance between touchStart and touchEnd to be detected as a swipe
    const minSwipeDistance = 50

    const onTouchStart = (e) => {
        setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance
        if (isLeftSwipe || isRightSwipe) {
            // ('swipe', isLeftSwipe ? navigate('/home') : navigate('/profile'))
            if (isRightSwipe) {
                navigate('/workshops')
            } else if (isLeftSwipe) {
            }
        }
        // add your conditional logic here
    }


    useEffect(() => {
        const onSetOrderTotal = () => {
            userOrders?.filter((filtUserORder) => {
                if (filtUserORder.status === "open") {
                    return filtUserORder
                } else {

                }
            }).map((userOrder) => {
                userOrder.status === "open" ? setOpenExis(true) : setOpenExis(false)
                setOrderTotal(
                    userOrder.status === "open" ?
                        timeSpent?.length > 0 ?
                            timeSpent[0] >= 2 || timeSpent[0] < 0 ? userOrder.total + 15 * userOrder.tickets.number : userOrder.total
                            : userOrder.total
                        : userOrder.timeSpent ?
                            userOrder.timeSpent[0] >= 2 || userOrder.timeSpent[0] < 0 ? userOrder.total + 15 * userOrder.tickets.number : userOrder.total
                            : userOrder.total
                )
            })


        }
        onSetOrderTotal()
    }, [timeSpent])
    return (
        <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} className='profile'>
            <nav>
                <Nav page={page} />
            </nav>
            <div className='profile_ico-section'>
                {/* <Link to="/"><IoArrowBackSharp className='profile_back-ico profile_ico' /></Link> */}
                <Link to="/edit-profile"><RiEdit2Fill className='profile_edit-ico profile_ico' /></Link>
            </div>
            <div className='profile_content-container'>
                <header>
                    <img className='profile_header_user-photo' src={user.photoURL ?? Profileblank} alt="" />
                    <div>
                        {
                            user.displayName.length > 12 ?
                                <div className='profile_header-user-info__long'>
                                    <h1 className='profile_heder_user-name__long'>{user.displayName}</h1>
                                    <p className='profile_heder_uid'>#{user.email[3] + user.uid[0] + user.uid[15] + user.uid[5] + user.uid[13]}</p>
                                </div>

                                :
                                <div className='profile_header-user-info'>
                                    <h1 className='profile_heder_user-name'>{user.displayName}</h1>
                                    <p className='profile_heder_uid'>#{user.email[3] + user.uid[0] + user.uid[15] + user.uid[5] + user.uid[13]}</p>
                                </div>}
                        {/* <p className='special-badge'><DiJsBadge className='special-badge-icon' /> Website Developer</p> */}
                    </div>


                </header>

                <sectoin className='profile_user-contacts-section'>
                    <div>
                        {/* <p className='profile_user-contacts'> <BsTelephone style={{ marginRight: "10px" }} /> {user.phoneNumber ?? "Nan"}</p> */}
                        <p className='profile_user-contacts'> <MdOutlineEmail style={{ position: "relative", top: "3px", marginRight: "10px" }} /> {user.email}</p>
                    </div>
                </sectoin>

                <section className='profile_activity-section'>
                    <div>
                        <p className='profile_activity-num'>0</p>
                        <p className='profile_activity-label'>Events</p>
                    </div>
                    <div>
                        <p className='profile_activity-num'>0</p>
                        <p className='profile_activity-label'>Workshops</p>
                    </div>
                    <Link style={{ textDecoration: "none" }} to="/profile/orders">
                        <div>
                            <p className='profile_activity-num'>{userOrders?.length ?? 0}</p>
                            <p className='profile_activity-label'>Orders</p>
                        </div></Link>
                </section>

                <hr className='inbetweenline' />

                <div className='profile_open-order-container'>
                    {
                        !openExis ? 
                        <p className='profile_no-open-order-msg'>No open order,  Looking to see you soon!</p>
                        :""
                    }
                    {
                        userOrders?.filter((filtUserORder) => {
                            if (filtUserORder.status === "open") {
                                return filtUserORder
                            } else {

                            }
                        }).map((userOrder) => (
                            userOrder ?
                                <div>
                                    <p> <strong>Id: #</strong>{userOrder?.userOrderId}</p>
                                    <p> <strong>Orderd at:</strong> {userOrder?.time}</p>
                                    <p className='profile_open-order_cart-header'>Cart: </p>
                                    <div className='profile_cart-items-continaer'>
                                        {
                                            userOrder?.cart.map((cartItem) => (
                                                <li>{cartItem.qty}x{cartItem?.item.name} {cartItem.qty * cartItem.item.price} L.e</li>
                                            ))}

                                    </div>
                                    < TimeSpent order={userOrder} onSetTimeSpent={onSetTimeSpent} timeSpent={timeSpent} />
                                    {
                                        timeSpent ?

                                            <p className='profile_open-order_tkt-type'><span>
                                                {
                                                    timeSpent[0] >= 2 || timeSpent[0] < 0 ? `Full day. + ${userOrder.tickets.number * 25}L.e` : `Half Day. + ${userOrder.tickets.number * 15}L.e`
                                                }</span></p>

                                            : ""
                                    }
                                    <p className='profile_open-order_total'>{orderTotal}L.e</p>
                                </div> : ""

                        ))
                    }
                </div>


            </div>
        </div>
    )
}

export default Profile