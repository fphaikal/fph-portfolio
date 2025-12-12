'use client'

import {
  Image,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider,
} from "@heroui/react";
import GlassCard from "@/components/ui/glass-card";
import { button as buttonStyles } from "@heroui/theme";
import { useState } from "react";

interface Certificate {
  name: string;
  company: string;
  year: string;
  image: string;
}

export default function Certificate({ certificate }: { certificate: Certificate[] }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  const handleView = (cert: Certificate) => {
    setSelectedCertificate(cert);
    onOpen();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {certificate.map((cert, index) => (
          <GlassCard key={index} className="w-full h-[200px] relative p-0 overflow-hidden group">
            <Image
              removeWrapper
              alt={`${cert.name} background`}
              className="z-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              src={cert.image}
            />
            <div className="absolute bottom-0 w-full z-10 p-3 bg-black/40 backdrop-blur-md border-t border-white/10 flex justify-between items-center">
              <div className="flex flex-col">
                <p className="text-tiny text-white/80">{`${cert.company} - ${cert.year}`}</p>
                <p className="text-sm text-white font-medium truncate max-w-[150px]">{cert.name}</p>
              </div>
              <Button onPress={() => handleView(cert)} radius="full" size="sm" variant="flat" className="bg-white/20 text-white hover:bg-white/30">
                View
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" classNames={{
        base: "bg-black/50 backdrop-blur-md border border-white/10 text-white"
      }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Certificate Details
              </ModalHeader>
              <ModalBody>
                <Image
                  removeWrapper
                  alt={`${selectedCertificate?.name} image`}
                  className="rounded-md w-full object-cover"
                  src={selectedCertificate?.image || "placeholder.png"}
                />
                <p className="text-white/90">
                  This certificate verifies the completion of the program "{selectedCertificate?.name}" conducted by{" "}
                  {selectedCertificate?.company}.
                </p>
                <Divider className="bg-white/20" />
                <p className="font-thin text-white/70">
                  {selectedCertificate?.company || "N/A"} - {selectedCertificate?.year || "N/A"}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
