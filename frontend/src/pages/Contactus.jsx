import ContactForm from "../components/ContactForm";
import BusinessIcon from "@mui/icons-material/Business";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import EmailIcon from "@mui/icons-material/Email";
import Footer from "../components/Footer";

export default function Contactus() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 px-6 py-10 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-2xl mt-8 sm:mt-10">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4 sm:mb-8">
          Contact Us
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Our dedicated customer support team is available to help you with any
          queries or concerns you may have.
        </p>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          For business-related inquiries, partnerships, or collaboration
          opportunities, please contact our business development team:
        </p>
        <p className="mt-6 text-lg leading-8 text-black">
          <BusinessIcon className="me-2 mb-2" fontSize="large" /> Rawalpindi,
          Pakistan
        </p>
        <p className="mt-6 text-lg leading-8 text-black">
          <LocalPhoneOutlinedIcon className="me-2 mb-2" fontSize="large" /> +92
          333 1234567
        </p>
        <p className="mt-6 text-lg leading-8 text-black">
          <EmailIcon className="me-2 mb-2" fontSize="large" />{" "}
          malikrashid82899@gmail.com
        </p>
      </div>
      <div>
        <ContactForm />
      </div>
    </div>
  );
}
