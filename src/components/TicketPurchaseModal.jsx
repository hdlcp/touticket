import { useState } from "react";
import { X, Plus, Minus, Trash2, Check } from "lucide-react";
import InfoGrid from "./InfoGrid.jsx";
import { useKKiaPay } from "kkiapay-react";
import { useEffect } from "react";
import { encryptData } from "./encryption";
import { buildPaymentPayload } from "./paymentPayload";


export default function TicketPurchaseModal({
  isOpen,
  onClose,
  eventTitle,
  tickets,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const { openKkiapayWidget, addKkiapayListener, removeKkiapayListener } =
    useKKiaPay();

 useEffect(() => {
  const onSuccess = (response) => {
    console.log("✅ Paiement signalé comme réussi :", response);

    // 👉 Étape 4 = paiement reçu, en attente de confirmation backend
    setCurrentStep(4);
  };

  const onFailure = (error) => {
    console.log("❌ Paiement échoué :", error);
    alert("Le paiement a échoué. Aucun montant n’a été débité.");
  };

  addKkiapayListener("success", onSuccess);
  addKkiapayListener("failed", onFailure);

  return () => {
    removeKkiapayListener("success", onSuccess);
    removeKkiapayListener("failed", onFailure);
  };
}, []);

  

const launchPayment = async () => {
  try {
    const itemsArray = selectedTickets.map(t => ({
      ticket_id: t.id,
      units: t.quantity
    }));

    const payload = buildPaymentPayload({
      itemsArray,
      purchase_item_logo: "https://drive.google.com/uc?export=download&id=1s7tCfN73oSli3YQZv2rajwH0-1KOMYX3"
    });

    const encryptedData = await encryptData(
      payload,
      import.meta.env.VITE_FERNET_KEY
    );

    openKkiapayWidget({
      amount: getTotalPrice(),
      api_key: import.meta.env.VITE_KKIAPAY_PUBLIC_KEY,
      sandbox: false,
      description: "Achat de ticket",
      data: encryptedData,
      callback_url: window.location.href
    });

    // 🔹 Forcer étape 4 côté UX
    setCurrentStep(4);

  } catch (error) {
    console.error("Erreur lors du paiement :", error);
    alert("Une erreur est survenue lors du paiement. Veuillez réessayer.");
  }
};




  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Fonction utilitaire pour obtenir le prix en nombre
  const getTicketPrice = (ticket) => {
    if (typeof ticket.price === "number") {
      return ticket.price;
    }
    if (typeof ticket.price === "string") {
      return parseInt(ticket.price.replace(/\s/g, ""));
    }
    return 0;
  };


  if (!isOpen) return null;

  const steps = [
    { number: 1, label: "Choix des pass" },
    { number: 2, label: "Panier" },
    { number: 3, label: "Paiement" },
    { number: 4, label: "Confirmation" },
  ];

  const handleQuantityChange = (ticketId, change) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    const existing = selectedTickets.find((t) => t.id === ticketId);

    const maxRemaining = ticket.remaining_places || ticket.remaining || 0;

    if (existing) {
      const newQuantity = existing.quantity + change;
      if (newQuantity <= 0) {
        setSelectedTickets(selectedTickets.filter((t) => t.id !== ticketId));
      } else if (newQuantity <= maxRemaining) {
        setSelectedTickets(
          selectedTickets.map((t) =>
            t.id === ticketId ? { ...t, quantity: newQuantity } : t,
          ),
        );
      }
    } else if (change > 0 && maxRemaining > 0) {
      setSelectedTickets([...selectedTickets, { ...ticket, quantity: 1 }]);
    }
  };

  const getTicketQuantity = (ticketId) => {
    return selectedTickets.find((t) => t.id === ticketId)?.quantity || 0;
  };

  const getTotalPrice = () => {
    return selectedTickets.reduce((total, ticket) => {
      const price = getTicketPrice(ticket);
      return total + price * ticket.quantity;
    }, 0);
  };

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };


  const handleBackToHome = () => {
    onClose();
    // Logique de retour à l'accueil
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Sélection des tickets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {tickets.map((ticket) => {
                const quantity = getTicketQuantity(ticket.id);
                const priceValue = getTicketPrice(ticket);
                const maxRemaining =
                  ticket.remaining_places || ticket.remaining || 0;

                return (
                  <div
                    key={ticket.id}
                    className="rounded-xl p-5 text-center transition-all shadow-xl border-3 border-gray-200 hover:bg-gray-100 bg-white"
                  >
                    <h3 className="font-bold text-black text-lg mb-2">
                      {ticket.label || ticket.type}
                    </h3>
                    <p className="text-2xl font-bold text-black mb-4">
                      {priceValue.toLocaleString()}{" "}
                      <span className="text-base font-semibold">FCFA</span>
                    </p>

                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => handleQuantityChange(ticket.id, -1)}
                        disabled={quantity === 0}
                        className="w-9 h-9 rounded-full border-2 border-[#E95503] text-[#E95503] flex items-center justify-center hover:bg-[#E95503] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <Minus className="w-5 h-5" />
                      </button>

                      <span className="text-2xl font-bold w-10 text-center text-gray-900">
                        {quantity}
                      </span>

                      <button
                        onClick={() => handleQuantityChange(ticket.id, 1)}
                        disabled={quantity >= maxRemaining}
                        className="w-9 h-9 rounded-full border-2 border-[#E95503] text-[#E95503] flex items-center justify-center hover:bg-[#E95503] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bouton d'ajout au panier */}
            <div className="flex justify-center">
              <button
                onClick={handleContinue}
                disabled={selectedTickets.length === 0}
                className="px-10 sm:px-16 md:px-20 mx-auto bg-main-gradient btn-gradient text-white font-bold text-lg py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                Ajouter au panier - {getTotalPrice().toLocaleString()} FCFA
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            {/* Liste des tickets sélectionnés */}
            {selectedTickets.map((ticket) => {
              const priceValue = getTicketPrice(ticket);
              const maxRemaining =
                ticket.remaining_places || ticket.remaining || 0;

              return (
                <div
                  key={ticket.id}
                  className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {ticket.label || ticket.type}
                      </h3>
                      <p className="text-xl font-bold text-gray-800 mt-1">
                        {priceValue.toLocaleString()}{" "}
                        <span className="text-sm">FCFA</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(ticket.id, -1)}
                        className="w-8 h-8 rounded-full border-2 border-[#E95503] text-[#E95503] flex items-center justify-center hover:bg-[#E95503] hover:text-white transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="text-xl font-bold w-8 text-center text-gray-900">
                        {ticket.quantity}
                      </span>

                      <button
                        onClick={() => handleQuantityChange(ticket.id, 1)}
                        disabled={ticket.quantity >= maxRemaining}
                        className="w-8 h-8 rounded-full border-2 border-[#E95503] text-[#E95503] flex items-center justify-center hover:bg-[#E95503] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          handleQuantityChange(ticket.id, -ticket.quantity)
                        }
                        className="ml-1 w-8 h-8 flex items-center justify-center text-[#E95503] hover:text-orange-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Total */}
            <div className="bg-white border-2 border-gray-300 rounded-xl p-5 mt-6">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">Totale</span>
                <span className="text-2xl font-bold text-gray-900">
                  {getTotalPrice().toLocaleString()}{" "}
                  <span className="text-base">FCFA</span>
                </span>
              </div>
            </div>

            {/* Bouton continuer */}
            <div className="flex justify-center">
              <button
                onClick={handleContinue}
                disabled={getTotalPrice() === 0}
                className="px-20 mx-auto btn-gradient bg-main-gradient text-white font-bold text-lg py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                Continuer
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-8 text-lg">
              Vous allez être redirigé vers la page de paiement sécurisée
            </p>
            <div className="flex justify-center">
              <button
                onClick={launchPayment}
                className="px-20 mx-auto bg-main-gradient text-white font-bold text-lg py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                Payer maintenant - {getTotalPrice().toLocaleString()} FCFA
              </button>
            </div>
          </div>
        );

    case 4:
  return (
    <div className="space-y-8 text-center py-8">

      {/* Loader */}
      <div className="flex justify-center">
        <div className="w-16 h-16 border-4 border-[#E95503] border-t-transparent rounded-full animate-spin"></div>
      </div>

      {/* Message principal */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Paiement en cours de confirmation
        </h3>

        <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
          Votre paiement a été reçu avec succès.  
          Nous confirmons actuellement la transaction.
        </p>
      </div>

      {/* Infos importantes */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-md mx-auto">
        <p className="text-xs text-gray-700 leading-relaxed">
          ⏳ <span className="font-semibold">Que se passe-t-il maintenant ?</span><br />
          • Votre paiement est en cours de validation<br />
          • Vos tickets seront générés automatiquement<br />
          • Vous recevrez un email avec votre QR code
        </p>
      </div>

      {/* Bouton */}
      <div className="pt-4">
        <button
          onClick={handleBackToHome}
          className="px-8 py-3 bg-main-gradient text-white font-bold rounded-full shadow-lg"
        >
          Fermer
        </button>
      </div>

    </div>
  );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl mx-2 md:mx-0">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 rounded-t-2xl z-10">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="text-gray-700 hover:text-black font-medium flex items-center gap-2"
                >
                  ← Retour
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-[#E95503] hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="w-full flex justify-center font-medium text-2xl mb-4">
            {eventTitle}
          </div>
          <h2 className="font-bold text-2xl md:text-3xl text-center mb-2">
            Firthy Chill EPAC
          </h2>
          <p className="text-sm text-gray-600 font-medium text-center mb-6">
            Réservez en quelques minutes, paiement 100% sécurisé
          </p>

          {/* Steps */}
          <div className="w-full overflow-x-auto pb-2">
            <div className="flex items-center justify-between max-w-lg mx-auto">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl transition-all shadow-md ${
                        step.number < currentStep
                          ? "bg-green-500 text-white"
                          : step.number === currentStep
                            ? "bg-[#E95503] shadow-[#E95503] shadow-2xl text-white"
                            : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step.number < currentStep ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <span
                      className={`text-xs text-center font-medium whitespace-nowrap ${
                        step.number <= currentStep
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 sm:w-16 h-1 mx-2 mb-6 transition-all ${
                        step.number < currentStep
                          ? "bg-main-gradient"
                          : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">{renderStepContent()}</div>
      </div>
    </div>
  );
}
