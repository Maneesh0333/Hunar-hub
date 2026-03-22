export default function calculateProfileCompleteness(
  entrepreneur,
  servicesCount,
) {
  let percentage = 0;
  const items = [];

  const basicInfoComplete = !!(
    entrepreneur.city &&
    entrepreneur.category &&
    entrepreneur.languages.length > 0 &&
    entrepreneur.experienceYears > 0 &&
    entrepreneur.user?.name &&
    entrepreneur.user?.phone
  );

  if (basicInfoComplete) percentage += 30;

  items.push({
    label: "Basic info complete",
    value: "+30%",
    completed: basicInfoComplete,
  });

  const verified = entrepreneur.verificationStatus === "Approved";

  if (verified) percentage += 30;

  items.push({
    label: "ID verification done",
    value: "+30%",
    completed: verified,
  });

  const servicesComplete = servicesCount >= 1;

  if (servicesComplete) percentage += 30;

  items.push({
    label: `Services listed (${servicesCount} active)`,
    value: "+30%",
    completed: servicesComplete,
  });

  const bioComplete = Boolean(entrepreneur.bio?.length);

  if (bioComplete) percentage += 20;

  items.push({
    label: "Bio written",
    value: "+20%",
    completed: bioComplete,
  });

  // Message based on percentage
  let message = "";

  if (percentage === 100) {
    message = "Perfect!.";
  } else if (percentage >= 70) {
    message = "Looking great!";
  } else if (percentage >= 40) {
    message = "Good start!";
  } else {
    message = "Complete your profile to attract more customers.";
  }

  return {
    percentage,
    items,
    message,
  };
}
