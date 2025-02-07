import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import supabase from "../../utils/supabaseClient";
import { Input, Button, Checkbox, Card, CardBody } from "@heroui/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../../components/InputPwsd"
import React from "react";

const Signin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async ({ email, password, remember }) => {
    setErrorMessage(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { persistSession: remember },
    });

    if (error) return setErrorMessage(error.message);
    navigate("/dashboard");
  };

  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="font-centuryGothic flex items-center justify-center min-h-screen bg-my-bg bg-no-repeat bg-cover">
      <Card className="p-8 rounded-2xl bg-white/10 backdrop-blur-lg shadow-lg w-80 md:w-[480px] xl:w-[849px] flex items-center justify-center">
        <CardBody className="bg-transparent xl:w-96 rounded-2xl flex-col">
          <h1 className="text-center text-3xl font-bold text-white mb-6">Bem vindo!</h1>
          <h2 className="text-center text-3xl font-normal text-white mb-6">LOGIN</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input 
              {...register("email", { required: "Email é obrigatório", pattern: { value: /\S+@\S+\.\S+/, message: "Email inválido" } })} 
              label="Email"
              type="email"
              className="mb-[24px]"
              variant="flat"
            />
            {errors.email && <span className="text-red-400 text-sm">{errors.email.message}</span>}

            <Input 
              {...register("password", { required: "Senha é obrigatória" })} 
              type={isVisible ? "text" : "password"} 
              onClick={toggleVisibility}
              label="Senha" 
              className=" rounded placeholder-white text-white mb-[24px]"
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
            />
            {errors.password && <span className="text-red-400 text-sm">{errors.password.message}</span>}

            <div className="flex justify-between items-center text-white">
              <label className="flex items-center gap-2 mb-6">
                <Checkbox {...register("remember")} className="accent-white" />
                Manter conectado
              </label>
            </div>
              <Link to="/forgotpassword" className="text-white text-sm underline mt-6">Esqueci minha senha</Link>

            {errorMessage && <span className="text-red-400 text-center">{errorMessage}</span>}

            <div className="flex justify-between">
              <Button 
              className="border-white text-white px-4 py-2 w-44 mr-3"
              variant="bordered"
              >
                <Link to="/signup">Criar conta</Link>
              </Button>
              <Button type="submit" className="bg-[#FFDFFF] text-[#008171] px-6 py-2 rounded-xl w-[268px]">Logar</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Signin;
