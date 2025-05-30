"use client";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
    const [studentNumber, setStudentNumber] = useState();
    const [studentRoom, setStudentRoom] = useState();
    const student_room = Array.from({ length: 14 }, (_, i) => `BTD 2/${i + 1}`);


    return (
        <div className="flex flex-col w-screen h-screen items-start box-border overflow-hidden py-8 px-20">
            {/* Header */}
            <div className="flex flex-row gap-4 items-center w-full h-16 my-2">
                <select
                    id="student-room"
                    className="p-2.5 border border-gray-300 rounded min-w-[150px] max-w-[200px]"
                    onChange={(e) => setStudentRoom(e.target.value)}
                >
                    <option value="">เลือกห้องเรียน</option>
                    {student_room.map((room) => (
                        <option key={room} value={room}>
                            {room}
                        </option>
                    ))}
                </select>
                <input
                    placeholder="กรอกเลขที่ 2 หลัก"
                    id="student_number"
                    name="student_number"
                    required
                    maxLength={2}
                    onChange={(e) => setStudentNumber(e.target.value)}
                    className="min-w-[150px] max-w-[200px] text-center border border-violet-500 rounded-lg focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 h-10"
                />
                <span className="text-2xl lg:text-4xl text-right flex-1">โปรแกรมสุ่มรหัส</span>
            </div>
            {/* line space */}
            <div className="bg-gray-500 w-full flex h-1 mt-4"></div>
            {/* Random Card */}
            <div className="flex flex-row w-full h-full">
                {/* Left Card Information Student */}
                <div className="flex flex-col w-1/3 justify-center items-center gap-4 border-r-3 border-gray-500">
                    <Image
                        alt="Student Image"
                        src="/Profile-Icon.png"
                        width={280}
                        height={400}
                        className="border border-black"
                    />
                    <div className="text-[22px]">เลขที่ {studentNumber}</div>
                    <div className="text-[22px]">รหัส xxxxxxxxxxxxx ชื่อ - สกุล XXXXXX</div>
                    <div className="text-[22px]">ห้อง {studentRoom}</div>
                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-[18px] px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 min-w-[150px] max-w-[250px] h-[60px]">สุ่มสายรหัส</button>
                </div>
                {/* Right Card Information student */}
                <div className="flex flex-row w-2/3 gap-4">
                    {/* first Card */}
                    <div className="flex flex-col justify-center items-center gap-4 w-1/2 mb-[85]">
                        <Image
                            alt="Student Image"
                            src="/Profile-Icon.png"
                            width={280}
                            height={400}
                            className="border border-black"
                        />
                        <div className="text-[22px]">เลขที่ XX</div>
                        <div className="text-[22px]">รหัส xxxxxxxxxxxxx ชื่อ - สกุล XXXXXX</div>
                        <div className="text-[22px]">ห้อง XXXX</div>
                    </div>
                    {/* Second Card */}
                    <div className="flex flex-col justify-center items-center gap-4 w-1/2 mb-[85]">
                        <Image
                            alt="Student Image"
                            src="/Profile-Icon.png"
                            width={280}
                            height={400}
                            className="border border-black"
                        />
                        <div className="text-[22px]">เลขที่ XX</div>
                        <div className="text-[22px]">รหัส xxxxxxxxxxxxx ชื่อ - สกุล XXXXXX</div>
                        <div className="text-[22px]">ห้อง XXXX</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
