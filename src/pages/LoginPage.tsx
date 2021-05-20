import React, { useEffect } from "react";
import PageContainer from "../components/common/PageContainer";
import EmojiHeader from "../components/common/EmojiHeader";
import { LOGIN_URL } from "../utils/constants";

// interface IFormInputs {
//   email: string;
//   password: string;
// }

const LoginPage = () => {
  useEffect(() => {
    window.location.href = LOGIN_URL;
  }, []);
  return (
    <PageContainer className="mx-auto mx-w-md w-full">
      <EmojiHeader
        src="/img/emoji/locked-with-key.svg"
        title="Redirecting to login page..."
      />
    </PageContainer>
  );

  // const dispatch = useStoreDispatch();

  // const history = useHistory();
  // const { register, handleSubmit, errors } = useForm<IFormInputs>();

  // const [apiError, setApiError] = useState("");
  // const [loading, setLoading] = useState(false);

  // const onSubmit = handleSubmit(async (formData) => {
  //   setLoading(true);
  //   const error = await dispatch.auth.login(formData);
  //   if (error) {
  //     setApiError(error.error_description);
  //   } else {
  //     setApiError("");
  //     history.push("/home");
  //     await dispatch.fetcher();
  //   }
  //   setLoading(false);
  // });

  // const emojiHeaderRegister = (
  //   <>
  //     Or{" "}
  //     <Link to="/register" className="text-green-400 hover:underline">
  //       register
  //     </Link>{" "}
  //     if you do not have an account
  //   </>
  // );

  // return (
  //   <>
  //     <Card className="mx-auto max-w-md w-full">
  //       <EmojiHeader
  //         src="/img/emoji/locked-with-key.svg"
  //         title="Sign in to your account"
  //         subtitle={emojiHeaderRegister}
  //       />

  //       {apiError && (
  //         <Alert color="red" title="Error" body={apiError} className="mt-4" />
  //       )}

  //       <form onSubmit={onSubmit} className="mt-8 space-y-3">
  //         <div>
  //           <Input
  //             label="Email"
  //             name="email"
  //             type="email"
  //             reg={register({ required: true })}
  //             errors={errors.email}
  //           />
  //         </div>
  //         <div>
  //           <Input
  //             label="Password"
  //             name="password"
  //             type="password"
  //             reg={register({ required: true })}
  //             errors={errors.password}
  //           />
  //         </div>

  //         <Button
  //           loading={loading}
  //           label="Login"
  //           icon={LoginIcon}
  //           onClick={onSubmit}
  //           type="submit"
  //         />
  //       </form>
  //     </Card>
  //   </>
  // );
};

export default LoginPage;
