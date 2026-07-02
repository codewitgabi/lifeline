export const SuccessResponse = <T>({
  message,
  data,
}: {
  message: string;
  data: T;
}) => ({
  success: true,
  message,
  data,
});
