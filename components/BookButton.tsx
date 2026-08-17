import Link from "next/link";

export default function BookButton({
  children = "Book Free Counselling",
  className = "btn btn-gold btn-shine",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href="/contact" className={className}>
      {children}
    </Link>
  );
}
