import { useState, useCallback } from "react";
import { CgClose, CgChevronLeft } from "react-icons/cg";
import { Inter } from "next/font/google";
import { getFlowerName, getFlowerPath } from "@/src/utils/flower.utils";
import Image from "next/image";
import { useModal } from "@/src/context/ModalContext";
import { useAppContext } from "@/src/context/AppContext";
import Button from "../ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LoadingSpinner } from "../ui/spinner";

interface Props {
  selectedFlower: FlowerType;
}

enum Faculty {
  IT = "IT",
  CS = "CS",
  DSI = "DSI",
}

// Inter fonts
const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });

// Schema validation with Zod
const CreateTraySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(30, "Name must be at most 30 characters"),
  message: z
    .string()
    .min(8, "Message must be at least 8 characters")
    .max(140, "Message must be at most 140 characters"),
  tag: z.nativeEnum(Faculty),
});

type CreateTrayInputs = z.infer<typeof CreateTraySchema>;

const CreateTray: React.FC<Props> = ({ selectedFlower }) => {
  const { setModalState } = useModal();
  const { saveTray } = useAppContext();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CreateTrayInputs>({
    resolver: zodResolver(CreateTraySchema),
  });

  const [selectedTag, setSelectedTag] = useState<Faculty>(Faculty.IT);
  const [loading, setLoading] = useState(false);

  const handleTagClick = (tag: Faculty) => {
    setSelectedTag(tag);
    setValue("tag", tag);
  };

  const handleBack = useCallback(() => {
    setModalState("selectTray");
  }, [setModalState]);

  const handleClose = useCallback(() => {
    setModalState("none");
  }, [setModalState]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (value.length > 140) {
      setError("message", {
        type: "manual",
        message: "Message cannot exceed 140 characters",
      });
    } else {
      clearErrors("message");
    }
    setValue("message", value, { shouldValidate: false });
  };

  const onSubmit: SubmitHandler<CreateTrayInputs> = useCallback(
    (data) => {
      setLoading(true);
      setModalState("none");

      saveTray(data.name, data.message, selectedFlower, data.tag, (result) => {
        if (result.success) {
          setLoading(false);
          setModalState("success");
          setTimeout(() => {
            setModalState("none");
          }, 2000);
        } else {
          setLoading(false);
          setModalState("error");
        }
      });
    },
    [selectedFlower, saveTray, setModalState]
  );

  return (
    <div
      className={`min-w-[200px] max-w-[350px] bg-white rounded-[32px] p-6 flex flex-col items-center gap-4 ${inter.className}`}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Close button and flower section */}
        <div className="w-full flex items-center justify-between">
          <div
            className="flex items-center hover:cursor-pointer"
            onClick={handleBack}
          >
            <CgChevronLeft size={32} />
            <div className="font-bold">back</div>
          </div>
          <div className="hover:cursor-pointer" onClick={handleClose}>
            <CgClose size={24} />
          </div>
        </div>

        <div className="pl-2 w-full flex items-center justify-between gap-4">
          <div>
            <Image
              src={getFlowerPath(selectedFlower)}
              alt="flower"
              layout="responsive"
              width={56}
              height={56}
            />
          </div>
          <div>
            <div className={`font-bold text-xl ${inter.className}`}>
              {getFlowerName(selectedFlower)}
            </div>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full outline-none border-b-[1px] border-b-slate-200 placeholder:text-sm"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
        </div>

        {/* Tag section */}
        <div className="self-start">
          <div className="mb-2">Tag</div>
          <div className="flex gap-2">
            {Object.values(Faculty).map((tag) => (
              <button
                type="button"
                key={tag}
                className={`rounded-full px-3 py-[4px] text-xs text-white font-bold ${
                  selectedTag === tag ? "opacity-100" : "opacity-40"
                } ${
                  tag === Faculty.IT
                    ? "bg-[#FC6C8D]"
                    : tag === Faculty.CS
                    ? "bg-[#A297C0]"
                    : "bg-[#8DB0C4]"
                }`}
                onClick={() => handleTagClick(tag as Faculty)}
              >
                <h1>{tag}</h1>
              </button>
            ))}
          </div>
        </div>

        {/* Textarea section */}
        <textarea
          placeholder="Write your message here"
          className="h-[148px] p-2 mt-4 rounded-md w-full outline outline-[2px] outline-slate-300 resize-none"
          {...register("message")}
          onChange={handleMessageChange}
        />
        {errors.message && (
          <p className="text-red-500">{errors.message.message}</p>
        )}

        {/* Hidden input for tag */}
        <input type="hidden" {...register("tag")} value={selectedTag} />

        {/* Submit button */}
        <div className="flex justify-center mt-4">
          <Button htmlType="submit" disabled={loading}>
            <div className="flex items-center">
              <h1>Submit</h1>
            </div>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTray;
