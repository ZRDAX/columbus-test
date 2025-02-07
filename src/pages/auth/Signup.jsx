import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import supabase from "../../utils/supabaseClient";
import { Input, Button, Card, CardBody  } from "@heroui/react";

const Signup = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit = async ({ name, email, password }) => {
    setErrorMessage(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) return setErrorMessage(error.message);
    navigate("/signin");
  };

  return (
    <div className="font-centuryGothic flex items-center justify-center min-h-screen bg-my-bg bg-no-repeat bg-cover">
      <Card className="p-8 rounded-2xl bg-white/10 backdrop-blur-sm shadow-lg w-auto md:w-[480px] xl:min-w-[849px] flex items-center justify-center">
        <CardBody className="bg-transparent w-72 xl:w-96 rounded-2xl flex-col">
            <h1 className="text-center text-3xl font-bold text-white mb-6">Bem vindo!</h1>
            <h2 className="text-center text-3xl font-normal text-white mb-6">CADASTRE-SE</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
              <Input 
                {...register("name", { required: "Nome é obrigatório" })} 
                label="Nome" 
                className=""
                endContent={
                  <>
                    {errors.name && <span className="text-red-400 text-sm">{errors.name.message}</span>}
                  </>
                }
              />

              <Input 
                {...register("email", { required: "Email é obrigatório", pattern: { value: /\S+@\S+\.\S+/, message: "Email inválido" } })} 
                label="Email" 
                className=""
                endContent={
                  <>
                    {errors.email && <span className="text-red-400 text-sm">{errors.email.message}</span>}
                  </>
                }
              />

              <Input 
                {...register("password", { required: "Senha é obrigatória", minLength: { value: 6, message: "Mínimo 6 caracteres" } })} 
                type="password" 
                label="Senha" 
                className=""
                endContent={
                  <>
                    {errors.password && <span className="text-red-400 text-sm">{errors.password.message}</span>}
                  </>
                }
              />

              <Input 
                {...register("confirmPassword", { required: "Confirme sua senha", validate: value => value === password || "Senhas não coincidem" })} 
                type="password" 
                label="Confirmação de senha" 
                className=""
                endContent={
                  <>
                  {errors.confirmPassword && <span className="text-red-400 text-sm">{errors.confirmPassword.message}</span>}
                  </>
                }
              />

              {errorMessage && <span className="text-red-400 text-center">{errorMessage}</span>}

              <div className="flex justify-between mt-14">
                <Button className="border-white text-white px-4 py-2 w-44 mr-3 text-xs" variant="bordered">
                  <Link to="/signin">Já tenho conta</Link>
                </Button>
                <Button type="submit" className="bg-[#FFDFFF] text-[#008171] px-6 py-2 rounded-xl w-[268px]">Cadastrar</Button>
              </div>
            </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Signup;
