import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { assets, facilityIcons, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const RoomDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const [checkInDate, setCheckInDate] = useState(
    searchParams.get("checkIn") || null,
  );
  const [checkOutDate, setCheckOutDate] = useState(
    searchParams.get("checkOut") || null,
  );
  const { rooms, getToken, axios, navigate } = useAppContext();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  // const [checkInDate, setCheckInDate] = useState(null);
  // const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [isAvailable, setIsAvailable] = useState(false);

  // Check if the Room is Available
  const checkAvailability = async () => {
    try {
      // Check is Check-In Date is greater than Check-Out Date
      if (checkInDate >= checkOutDate) {
        toast.error("Check-In Date should be less than Check-Out Date");
        return;
      }
      const { data } = await axios.post("/api/bookings/check-availability", {
        room: id,
        checkInDate,
        checkOutDate,
      });

      if (data.success) {
        if (data.isAvailable) {
          setIsAvailable(true);
          toast.success("Room is available");
        } else {
          setIsAvailable(false);
          toast.error("Room is unavailable");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // onSubmitHandler function to check availability & book the room
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      if (!isAvailable) {
        return checkAvailability();
      } else {
        const { data } = await axios.post(
          "/api/bookings/book",
          {
            room: id,
            checkInDate,
            checkOutDate,
            guests,
            paymentMethod: "Pay At Hotel",
          },
          { headers: { Authorization: `Bearer ${await getToken()}` } },
        );
        if (data.success) {
          toast.success(data.message);
          navigate("/my-bookings");
          scrollTo(0, 0);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getDynamicPrice = (basePrice, checkIn, checkOut) => {
    if (!checkIn || !checkOut) return basePrice;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    let maxMultiplier = 1;
    const current = new Date(start);
    while (current < end) {
      const day = current.getDay();
      const isWeekend = day === 0 || day === 6;
      if (isWeekend) maxMultiplier = Math.max(maxMultiplier, 1.25);
      current.setDate(current.getDate() + 1);
    }
    return Math.round(basePrice * maxMultiplier);
  };

  useEffect(() => {
    const room = rooms.find((room) => room._id === id);
    room && setRoom(room);
    room && setMainImage(room.images[0]);
  }, [rooms]);

  return (
    room && (
      <div className="py-28 md:py-35 px-4 md:px-16 1g:px-24 xl:px-32">
        {/* Room Details */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <h1 className="text-3x1 md:text-4x1 font-playfair">
            {room.hotel.name}
            <span className="font-inter text-sm">({room.roomType})</span>
          </h1>
          <p
            className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500
rounded-full"
          >
            20% OFF
          </p>
        </div>
        {/* Room Raiting */}
        <div className="flex items-center gap-1 mt-2">
          <StarRating />
          <p className="m1-2">200+ reviews</p>
        </div>
        {/* Room Address */}
        <div className="flex items-center gap-1 text-gray-500 mt-2">
          <img src={assets.locationIcon} alt="location-icon" />
          <span>{room.hotel.address}</span>
        </div>
        {/* Room Images */}
        <div className="flex flex-col lg:flex-row mt-6 gap-6">
          <div className="lg:w-1/2 w-full">
            <img
              src={mainImage}
              alt="Room Image"
              className="w-full rounded-xl shadow-lg object-cover"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
            {room?.images.length > 1 &&
              room.images.map((image, index) => (
                <img
                  onClick={() => setMainImage(image)}
                  key={index}
                  src={image}
                  alt="Room Image"
                  className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${image === mainImage && "outline-orange-500"}`}
                />
              ))}
          </div>
        </div>

        {/* Room Highlights */}
        <div className="flex flex-col md:flex-row md:justify-between mt-10">
          <div className="flex flex-col">
            <h1 className="text-3x1 md:text-4x1 font-playfair">
              Experience Luxury Like Never Before
            </h1>
            <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
              {room.amenities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
                >
                  <img
                    src={facilityIcons[item]}
                    alt={item}
                    className="w-5 h-5"
                  />
                  <p className="text-xs">{item}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Room Price */}
          <p className="text-2xl font-bold">
            ${getDynamicPrice(room.pricePerNight, checkInDate, checkOutDate)}
            /night
          </p>
        </div>

        {/* CheckIn Checkout Form */}
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col md:flex-row items-start md:items-center
justify-between bg-white shadow-[0px 0px 20px rgba(0,0,0,0.15)] p-6 rounded-x1
mx-auto mt-16 max-w-6x1"
        >
          <div
            className="flex flex-col flex-wrap md:flex-row items-start
md:items-center gap-4 md:gap-10 text-gray-500"
          >
            <div className="flex flex-col">
              <label htmlFor="checkInDate" className="font-medium">
                Check-In
              </label>
              <input
                value={checkInDate || ""}
                onChange={(e) => setCheckInDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                type="date"
                id="checkInDate"
                placeholder="Check-In"
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5
outline-none"
                required
              />
            </div>
            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>
            <div className="flex flex-col">
              <label htmlFor="checkOutDate" className="font-medium">
                Check-Out
              </label>
              <input
                value={checkOutDate || ""}
                onChange={(e) => setCheckOutDate(e.target.value)}
                min={checkInDate}
                disabled={!checkInDate}
                type="date"
                id="checkOutDate"
                placeholder="Check-Out"
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5
outline-none"
                required
              />
            </div>
            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>
            <div className="flex flex-col">
              <label htmlFor="guests" className="font-medium">
                Guests
              </label>
              <input
                onChange={(e) => setGuests(e.target.value)}
                value={guests}
                type="number"
                id="guests"
                placeholder="1"
                className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dull
active: scale-95 transition-all text-white rounded-md max-md:w-full
max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer"
          >
            {isAvailable ? "Book Now" : "Check Availability"}
          </button>
        </form>

        {/* Common Specifications */}
        <div className="mt-25 space-y-4">
          {roomCommonData.map((spec, index) => (
            <div key={index} className="flex items-start gap-2">
              <img
                src={spec.icon}
                alt={`${spec.title}-icon`}
                className="w-6.5"
              />
              <div>
                <p className="text-base">{spec.title}</p>
                <p className="text-gray-500">{spec.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Hosted by */}
        <div className="flex flex-col items-start gap-4">
          <div className=" flex gap-4">
            <img
              src={room.hotel.owner.image}
              alt="Host"
              className="h-14 w-14
md:h-18 md:w-18 rounded-full"
            />
            <div>
              <p className="text-lg md:text-xl">Hosted by {room.hotel.name}</p>
              <div className="flex items-center mt-1">
                <StarRating />
                <p className="m1-2">200+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default RoomDetails;
