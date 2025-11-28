import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  goal: z.string().min(10, "Please share more about your goal (at least 10 characters)").max(200, "Goal must be less than 200 characters"),
});

type FormData = z.infer<typeof formSchema>;

interface LightFormProps {
  onSubmit: (data: FormData) => void;
  isSubmitting?: boolean;
  availableBuildings: number;
}

export default function LightForm({ onSubmit, isSubmitting, availableBuildings }: LightFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      goal: "",
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
    form.reset();
  };

  const isDisabled = availableBuildings === 0;

  return (
    <section className="py-16 md:py-24 px-4" id="light-form" data-testid="light-form-section">
      <div className="max-w-xl mx-auto">
        <Card
          className="border-primary/20 overflow-visible"
          style={{
            background: "linear-gradient(135deg, rgba(15, 20, 25, 0.9) 0%, rgba(26, 31, 46, 0.9) 100%)",
            boxShadow: "0 0 40px rgba(169, 112, 255, 0.1)",
          }}
        >
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(169, 112, 255, 0.2)" }}>
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl md:text-3xl text-white" data-testid="form-title">
              Light Your Mark
            </CardTitle>
            <CardDescription className="text-white/60 text-base">
              Share your ambition and illuminate a building on the skyline
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {isDisabled ? (
              <div className="text-center py-8">
                <p className="text-white/70 mb-2">All buildings are currently illuminated!</p>
                <p className="text-sm text-white/50">Check back later for more opportunities.</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Your Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your name"
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20"
                            data-testid="input-name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="goal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Your Goal / Ambition</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What's your dream? Share your ambition with the world..."
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20 resize-none min-h-[100px]"
                            data-testid="input-goal"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full py-6 text-lg"
                    disabled={isSubmitting}
                    style={{
                      background: "linear-gradient(135deg, #7c4dff 0%, #a970ff 100%)",
                      boxShadow: "0 0 20px rgba(169, 112, 255, 0.3)",
                    }}
                    data-testid="button-submit"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">
                          <Sparkles className="h-5 w-5" />
                        </span>
                        Illuminating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Illuminate Your Building
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            )}
            <p className="text-center text-xs text-white/40 mt-6">
              {availableBuildings} building{availableBuildings !== 1 ? "s" : ""} available to illuminate
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
