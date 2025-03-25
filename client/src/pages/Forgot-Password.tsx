import Input from "@/components/Input";
import { SubmitHandler, useForm } from "react-hook-form";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<{ email: string }>();

  const handleForgotPassword: SubmitHandler<{ email: string }> = (data) => {
    console.log(data);
  };

  return (
    <div className="absolute  inset-0 bg-black/50 flex items-center justify-center">
      <form
        className="flex flex-col w-[90%] md:w-1/2 xl:w-1/3 bg-white p-6 rounded-sm items-center justify-center "
        onSubmit={handleSubmit(handleForgotPassword)}
      >
        <h1 className="text-2xl font-semibold">Fogot Password?</h1>
        <div className="w-full flex flex-col gap-y-2 mt-8">
          <Input
            label="Email :"
            type="email"
            placeholder="Enter Email..."
            {...register("email", { required: "Email is required..." })}
          />
          {errors.email && (
            <p className="text-red-700 ml-3">{errors.email.message}...</p>
          )}
        </div>
        <button
          className="bg-black px-6 py-2 text-white rounded-md mt-8"
          type="submit"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
