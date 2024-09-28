import React from 'react';
import { Footer } from 'flowbite-react';

const CustomFooter = () => {
  return (
    <Footer container className="bg-white shadow-md no-interact">
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div>
            <Footer.Brand
              href="/"
              src="/logo1.png?height=100&width=100"
              alt="UV Logo"
              name="Universidad Veracruzana"
            />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="Acerca de" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Historia</Footer.Link>
                <Footer.Link href="#">Misión y Visión</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Políticas" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Política de privacidad</Footer.Link>
                <Footer.Link href="#">Términos y condiciones</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Contacto" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Directorio</Footer.Link>
                <Footer.Link href="#">Ubicaciones</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="Universidad Veracruzana"
            year={2023}
          />
        </div>
      </div>
    </Footer>
  );
}

export default CustomFooter;
