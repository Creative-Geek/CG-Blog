import { useEffect, useState } from "react";
import { BASE_URL } from "~/config/constants";
import { Button } from "~/components/ui/button";

interface ContactProps {
  loading?: boolean;
  title?: string;
  text?: string;
  buttonLink?: string;
}

export default function Contact({
  loading,
  title,
  text,
  buttonLink,
}: ContactProps) {
  if (loading) {
    return (
      <section className="container py-16">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <div className="h-8 w-64 animate-pulse rounded-md bg-muted mx-auto" />
          <div className="h-4 w-96 animate-pulse rounded-md bg-muted mx-auto" />
          <div className="h-10 w-32 animate-pulse rounded-md bg-muted mx-auto" />
        </div>
      </section>
    );
  }

  if (!title || !text || !buttonLink) return null;

  return (
    <section className="container py-16">
      <div className="mx-auto max-w-3xl text-center space-y-6">
        <h2 className="text-3xl font-bold tracking-tighter">{title}</h2>
        <p className="text-lg text-muted-foreground">{text}</p>
        <Button variant="accent" asChild size="lg">
          <a href={buttonLink}>Contact Me</a>
        </Button>
      </div>
    </section>
  );
}
