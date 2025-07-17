import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Form, Button, Card } from "react-bootstrap";
import "./Login.scss";
import { toast } from "react-toastify";
import type { CountryApiResponse } from "../../interface";
import { useNavigate } from "react-router";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  country: z.string().min(1, "Select a country"),
  phone: z
    .string()
    .min(6, "Phone number is required")
    .regex(/^[0-9]{6,15}$/, "Enter a valid phone number"),
  otp: z.string().min(6).max(6).regex(/^\d+$/, "OTP must be 6 digits"),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const [showOtp, setShowOtp] = useState(false);
  const [countries, setCountries] = useState<
    { name: string; code: string; dial_code: string | null }[]
  >([]);
  const [timer, setTimer] = useState<number>(0);

  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    axios
      .get<CountryApiResponse[]>(
        "https://restcountries.com/v3.1/all?fields=name,cca2,idd"
      )
      .then((res) => {
        const data = res.data
          .map((country) => {
            const dialRoot = country.idd?.root;
            const suffix = country.idd?.suffixes?.[0];
            return {
              name: country.name?.common,
              code: country.cca2,
              dial_code: dialRoot && suffix ? `${dialRoot}${suffix}` : null,
            };
          })
          .filter((c) => c.dial_code)
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(data);
      })
      .catch((err) => {
        console.error("Failed to fetch countries:", err);
      });
  }, []);

  const onSubmit = (data: FormData) => {
    toast.success("Successfully logged in.", { pauseOnHover: false });
    localStorage.setItem("loginData", JSON.stringify(data));
    navigate("/");
  };

  const handleSendOtp = () => {
    setShowOtp(true);
    setTimer(5);

    toast.success("OTP successfully sended.", { pauseOnHover: false });

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          const generatedOtp = "123456";
          setValue("otp", generatedOtp);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const watchedPhone = watch("phone");
  const watchedCountry = watch("country");

  return (
    <div id="login-page">
      <Card className="login-card">
        <h3 className="mb-4 text-center">Login with OTP</h3>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" {...register("name")} />
            {errors.name && (
              <Form.Text className="text-danger">
                {errors.name.message}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCountry">
            <Form.Label>Country Code</Form.Label>
            <Form.Select {...register("country")}>
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c.code} value={c.dial_code!}>
                  {c.name} ({c.dial_code})
                </option>
              ))}
            </Form.Select>
            {errors.country && (
              <Form.Text className="text-danger">
                {errors.country.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="phone" {...register("phone")} />
            {errors.phone && (
              <Form.Text className="text-danger">
                {errors.phone.message}
              </Form.Text>
            )}
          </Form.Group>
          <div className="d-grid mb-3">
            <Button
              variant="primary"
              type="button"
              onClick={handleSendOtp}
              disabled={timer > 0 || !watchedPhone || !watchedCountry}
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : "Send OTP"}
            </Button>
          </div>

          {showOtp && (
            <Form.Group className="mb-3" controlId="formOtp">
              <Form.Label>OTP</Form.Label>
              <Form.Control type="text" {...register("otp")} />
              {errors.otp && (
                <Form.Text className="text-danger">
                  {errors.otp.message}
                </Form.Text>
              )}
            </Form.Group>
          )}

          <div className="d-grid">
            <Button variant="success" type="submit">
              Login
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
