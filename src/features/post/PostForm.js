import React, { useCallback } from "react";

import { FormProvider, FTextField, FUploadImage } from "../../components/form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";

import { Box, Card, Stack, alpha } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { createPost } from "./postSlice";

const editFormSchema = Yup.object().shape({
  content: Yup.string().required("Content is required"),
});

function PostForm() {
  const defaultValues = {
    content: "",
    image: "",
  };
  const methods = useForm({
    resolver: yupResolver(editFormSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const { isLoading } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    dispatch(createPost(data)).then(() => reset());
  };
  // useCallback ghi nhớ hàm,chaỵ sau cùng
  // image : {file: {preview:"thuật toán ảnh"}}
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          "image",
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );
  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <FTextField
            name="content"
            multiline
            fullWidth
            rows={4}
            placeholder="Share what are you thinking here..."
            sx={{
              "&fieldset": {
                borderWidth: "1px !important",
                borderColor: alpha("#919EAB", 0.32),
              },
            }}
          />
          {/* <FTextField name="image" placeholder="Image" /> */}
          {/*  type = "file" ko control dc */}
          {/* <input type="file" onChange={handleDrop} /> */}
          <FUploadImage
            name="image"
            accept={{
              "image/*": [".jpeg", ".jpg", ".png"],
            }}
            maxSize={3145728}
            onDrop={handleDrop}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <LoadingButton
              type="submit"
              variant="contained"
              size="small"
              loading={isSubmitting || isLoading}
            >
              Post
            </LoadingButton>
          </Box>
        </Stack>
      </FormProvider>
    </Card>
  );
}

export default PostForm;
