interface DashboardHeaderProps {
    heading: string;
    text?: string;
  }
  
  export const DashboardHeader = ({ heading, text }: DashboardHeaderProps) => {
    return (
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">{heading}</h2>
        {text && <p className="text-muted-foreground">{text}</p>}
      </div>
    );
  };