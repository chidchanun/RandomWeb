"use client";
import Image from "next/image";
import { useState, useEffect, useMemo, useCallback } from "react";
import useSWR from "swr";
import AlertCard from "@/app/components/AlertCard";

// SWR fetcher
const fetcher = (url) => fetch(url).then(res => res.json());

export default function Page() {
    const [studentNumber, setStudentNumber] = useState("");
    const [studentRoom, setStudentRoom] = useState("");
    const [students, setStudents] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const isButtonDisabled = !studentNumber || !studentRoom;

    // For tooltip visibility
    const [showTooltip, setShowTooltip] = useState(false);

    // Fetch classrooms
    const { data: classrooms = [] } = useSWR("/api/classrooms", fetcher);

    // Fetch students based on studentRoom and studentNumber with debounce and abort
    useEffect(() => {
        if (!studentRoom) {
            setStudents([]);
            return;
        }

        const controller = new AbortController();
        const params = new URLSearchParams({ classroom: studentRoom });
        if (studentNumber) params.append("student_number", studentNumber);

        const fetchStudents = async () => {
            try {
                const res = await fetch(`/api/students?${params.toString()}`, {
                    signal: controller.signal,
                });
                if (!res.ok) throw new Error("Failed to fetch students");
                const data = await res.json();
                setStudents(data);
            } catch (err) {
                if (err.name !== "AbortError") console.error("Error fetching students:", err);
            }
        };

        const timer = setTimeout(fetchStudents, 300);
        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [studentRoom, studentNumber]);

    const mainStudent = students[0] || null;

    // Upload image handler
    const handleUploadImage = useCallback(() => {
        if (!selectedImage || !mainStudent?._id) {
            alert("กรุณาเลือกนักเรียนและอัปโหลดรูป");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Image = reader.result;

            try {
                const res = await fetch("/api/student-images", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        student_id: mainStudent._id,
                        image: base64Image,
                    }),
                });

                const result = await res.json();
                setUploadStatus(res.ok ? "✅ อัปโหลดสำเร็จ!" : "❌ อัปโหลดไม่สำเร็จ");
                if (!res.ok) console.error(result.error);
            } catch (err) {
                setUploadStatus("❌ อัปโหลดไม่สำเร็จ");
                console.error(err);
            }
        };

        reader.readAsDataURL(selectedImage);
    }, [selectedImage, mainStudent]);

    // Memoize the top 3 students slice
    const displayStudents = useMemo(() => students.slice(0, 3), [students]);

    // Extract reusable Image component for student photo
    const StudentImage = ({ student }) => (
        <Image
            alt="Student Image"
            src={student?.image || "/Profile-Icon.png"}
            width={280}
            height={400}
            className="border border-black"
            loading="eager"
        />
    );

    return (
        <div className="flex flex-col w-screen h-screen items-start box-border overflow-hidden py-8 px-20">
            {/* Header */}
            <div className="flex flex-row gap-4 items-center w-full h-16 my-2">
                <select
                    id="student-room"
                    className="p-2.5 border border-gray-300 rounded min-w-[150px] max-w-[200px]"
                    onChange={(e) => setStudentRoom(e.target.value)}
                    value={studentRoom}
                >
                    <option value="">เลือกห้องเรียน</option>
                    {classrooms.map((room) => (
                        <option key={room} value={room}>
                            {room}
                        </option>
                    ))}
                </select>

                <input
                    placeholder="กรอกเลขที่ 2 หลัก"
                    id="student_number"
                    name="student_number"
                    maxLength={2}
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                    className="min-w-[150px] max-w-[200px] text-center border border-violet-500 rounded-lg focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 h-10"
                />

                {mainStudent?._id && (
                    <div className="flex flex-col items-center gap-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setSelectedImage(e.target.files[0])}
                            className="text-[14px]"
                        />
                        <button
                            type="button"
                            onClick={handleUploadImage}
                            className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-[16px] px-4 py-2 focus:outline-none"
                        >
                            📤 อัปโหลดรูปนักเรียน
                        </button>
                        {uploadStatus && <p className="text-sm">{uploadStatus}</p>}
                    </div>
                )}

                <span className="text-2xl lg:text-4xl text-right flex-1">โปรแกรมสุ่มรหัส</span>
            </div>

            {/* Divider */}
            <div className="bg-gray-500 w-full flex h-1 mt-4 min-h-1"></div>

            {/* Random Card */}
            <div className="flex flex-row w-full h-full">
                {/* Left Student Card */}
                <div className="flex flex-col w-1/3 justify-center items-center gap-4 relative">
                    <StudentImage student={mainStudent} />
                    <div className="xl:text-[20px] lg:text-[18px] md:text-[10px]">เลขที่ {studentNumber || "โปรดกรอกเลขที่ให้เรียบร้อย"}</div>
                    <div className="xl:text-[20px] lg:text-[18px] md:text-[10px]">
                        รหัส {mainStudent?.student_id || "ไม่พบข้อมูล"}{" "}
                        {mainStudent?.full_name || "ชื่อ - สกุล ไม่พบข้อมูล"}
                    </div>
                    <div className="xl:text-[20px] lg:text-[18px] md:text-[10px]">ห้อง {studentRoom || "โปรดเลือกห้องให้เรียบร้อย"}</div>
                    <button
                        type="button"
                        disabled={isButtonDisabled}
                        onClick={() => {
                            if (!isButtonDisabled) setShowAlert(true);
                        }}
                        onMouseEnter={() => {
                            if (isButtonDisabled) setShowTooltip(true);
                        }}
                        onMouseLeave={() => setShowTooltip(false)}
                        className={`relative cursor-pointer text-white font-medium rounded-lg text-[18px] px-5 py-2.5 me-2 mb-2 min-w-[150px] max-w-[250px] h-[60px] focus:outline-none
                            ${isButtonDisabled
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            }
                        `}
                    >
                        สุ่มสายรหัส

                        {/* Tooltip */}
                        {showTooltip && (
                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-1 text-sm text-white bg-black rounded shadow-lg whitespace-nowrap z-50">
                                โปรดเลือกห้องเรียนและเลขที่นักเรียนก่อน
                            </div>
                        )}
                    </button>
                    <div className="absolute border-r-3 border-gray-500 w-1.5 h-full left-full"></div>
                </div>

                {/* Right Side Students */}
                <div className="flex flex-row w-2/3 gap-4 mx-2">
                    {/* first Card */}
                    <div className="flex flex-col justify-center items-center gap-4 w-1/2 mb-[85]">
                        <Image
                            alt="Student Image"
                            src="/Profile-Icon.png"
                            width={280}
                            height={400}
                            className="border border-black"
                        />
                        <div className="xl:text-[20px] lg:text-[18px] md:text-[10px]">เลขที่ XX</div>
                        <div className="xl:text-[20px] lg:text-[18px] md:text-[10px]">รหัส xxxxxxxxxxxxx ชื่อ - สกุล XXXXXX</div>
                        <div className="xl:text-[20px] lg:text-[18px] md:text-[10px]">ห้อง XXXX</div>
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
                        <div className="xl:text-[20px] lg:text-[18px] md:text-[10px]">เลขที่ XX</div>
                        <div className="xl:text-[20px] lg:text-[18px] md:text-[10px]">รหัส xxxxxxxxxxxxx ชื่อ - สกุล XXXXXX</div>
                        <div className="xl:text-[20px] lg:text-[18px] md:text-[10px]">ห้อง XXXX</div>
                    </div>
                </div>
            </div>
            {showAlert && (
                <AlertCard
                    student={{
                        student_number: studentNumber,
                        student_id: mainStudent?.student_id || "",
                        full_name: mainStudent?.full_name || "",
                        studentRoom,
                    }}
                    onConfirm={() => {
                        alert("คุณกดยืนยันแล้ว");
                        setShowAlert(false);
                    }}
                    onCancel={() => setShowAlert(false)}
                />
            )}
        </div>

    );
}
