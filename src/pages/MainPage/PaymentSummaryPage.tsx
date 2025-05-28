import MainFooter from "@/components/InfoBar/MainFooter.tsx";
import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import {useState} from "react";
import PhotoInputer from "@/components/PhotoInputer.tsx";
import {FaCheckCircle} from "react-icons/fa";

function PaymentSummaryPage() {

    const [status, setStatus] = useState(3)
    const [photoEvidence, setPhotoEvidence] = useState<File|null>(null)
    const detail={
        id: 'INV-00123',
            customerName: 'John Doe',
            date: '2025-05-28',
            items: [
            { description: 'Web Hosting', quantity: 1, price: 250000 },
            { description: 'Domain Name', quantity: 1, price: 150000 },
        ],
            total: 400000,
            paid: false,
    }

    function confirmPayment(){
        setStatus(1)
    }

    function takePhoto(file: File) {
        setPhotoEvidence(file);
    }

    function paymentStatus(){
        if (status == 1){
            return (
                <div className={"flex flex-col items-center justify-center gap-5"}>
                    <div className={"text-center"}>
                        <span>Your payment is now due. Please transfer to BCA account under the name Nus Kusuma with account number</span>
                        <a className={"text-[#EE7C9E] font-bold cursor-pointer pl-1"} onClick={confirmPayment}>1234567890</a>
                        <span>. After the transfer, kindly upload your payment receipt. We will verify your payment as soon as possible.</span>
                    </div>
                    <PhotoInputer onChange={takePhoto}/>
                </div>

            )
        }else if(status == 2){
            return (
                <div className={"flex flex-col items-center justify-center gap-5"}>
                    <div className={"text-center"}>
                        <span>Your payment is overdue. Please make the transfer immediately to avoid warnings on your MbakCare account. You can transfer to the BCA account under the name Nus Kusuma with account number</span>
                        <a className={"text-[#EE7C9E] font-bold cursor-pointer pl-1"} onClick={confirmPayment}>1234567890</a>
                        <span>. After completing the transfer, kindly upload your payment receipt so we can verify it as soon as possible.</span>
                    </div>
                    <PhotoInputer onChange={takePhoto}/>
                </div>
            )
        }else if(status == 3){
            return (
                <div className={"flex flex-col items-center justify-center gap-5"}>
                    <p>We’ve received and verified your payment. Thank you for completing the transaction!</p>
                    <div className={"text-[#EE7C9E] flex flex-col items-center justify-center gap-2.5"}>
                        <FaCheckCircle className={"size-24 "}/>
                        <h3 className={"text-xl font-bold"}>Payment Received</h3>
                    </div>
                </div>
            )
        }

        return (
            <div className={"text-center flex flex-row gap-1 items-center justify-center"}>
                <span>Your payment is not yet due. Please return on</span>
                <a className={"text-[#EE7C9E] font-bold cursor-pointer"}>September 7, 2025</a>
                <span>to make your payment.</span>
            </div>
        )
    }

    return (
        <div className={"min-h-screen min-w-full max-w-screen h-full"}>
            <NavigationBar/>
            <div className={"flex flex-col w-full h-full px-8 md:px-64 py-8 pt-40 gap-8 text-[#492924]"}>
                <div className="flex flex-col items-center justify-center relative">
                    <h1 className={"font-bold text-4xl text-center"}>Monthly Payment Summary</h1>
                    <div className="w-96 h-0.5 bg-[#DA807B] mt-2 rounded-md"></div>
                </div>
                <div className={"bg-[#F7F8F1] p-8 rounded-md shadow-md flex flex-col gap-10"}>
                    <div className={"flex flex-row gap-5 items-center"}>
                        <div className={"font-semibold text-md"}>
                            <p>Customer Name</p>
                            <p>Helper Name</p>
                            <p>Helper Level</p>
                            <p>Service Period</p>
                            <p>Contract Duration</p>
                        </div>

                        <div className={"text-md"}>
                            <p>: Jose Christian</p>
                            <p>: Kevin Pramudya Mahardika</p>
                            <p>: 1</p>
                            <p>: August 1st, 2025</p>
                            <p>: 2 Years</p>
                        </div>
                    </div>

                    <div className={"flex flex-col gap-5"}>
                        <h2 className={"text-xl text-[#EE7C9E]"}>Payment Breakdown</h2>
                        <div className="border-t pt-4">
                            <table className="w-full text-left">
                                <thead>
                                <tr className="text-sm border-b">
                                    <th className="py-2">Description</th>
                                    <th>Quantity</th>
                                    <th>Rate</th>
                                    <th>Total Amount</th>
                                </tr>
                                </thead>
                                <tbody>
                                {detail.items.map((item, idx) => (
                                    <tr key={idx} className="text-sm border-b">
                                        <td className="py-2">{item.description}</td>
                                        <td>{item.quantity}</td>
                                        <td>Rp {item.price.toLocaleString()}</td>
                                        <td>Rp {(item.price * item.quantity).toLocaleString()}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            <div className="flex justify-start mt-4">
                                <div className="w-1/2 text-left">
                                    <div className={"flex flex-row gap-2.5 items-center"}>
                                        <p className="font-semibold text-lg ">
                                            Total Amount Payable:
                                        </p>
                                        <p className="font-semibold text-lg text-[#EE7C9E]">Rp {detail.total.toLocaleString()},00</p>
                                    </div>

                                    <p className={`text-sm ${detail.paid ? 'text-green-600' : 'text-red-600'}`}>
                                        {detail.paid ? 'Paid' : 'Unpaid'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center relative">
                    <h1 className={"font-bold text-4xl text-center"}>Notice</h1>
                    <div className="w-24 h-0.5 bg-[#DA807B] mt-2 rounded-md"></div>
                </div>
                <div>
                    {paymentStatus()}
                </div>


            </div>
            <MainFooter/>
        </div>
    );
}

export default PaymentSummaryPage;