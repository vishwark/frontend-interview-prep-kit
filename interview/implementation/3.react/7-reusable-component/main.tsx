import React from 'react';
import Button from './components/Button';
import Card from './components/Card';
import Accordion, { AccordionItem } from './components/Accordion';

/**
 * ReusableComponentsDemo
 * 
 * A demo component that showcases all the reusable UI components:
 * - Button Component with different variants, sizes, and states
 * - Card Component with different sections and variants
 * - Accordion Component with single and multiple open sections
 */
const ReusableComponentsDemo: React.FC = () => {
  // Sample icon for button demonstration
  const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
    </svg>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Reusable UI Components</h1>
      
      {/* Button Component Demo */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Button Component</h2>
        
        <div className="space-y-6">
          {/* Button Variants */}
          <div>
            <h3 className="text-lg font-medium mb-3">Button Variants</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
            </div>
          </div>
          
          {/* Button Sizes */}
          <div>
            <h3 className="text-lg font-medium mb-3">Button Sizes</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="small">Small</Button>
              <Button size="medium">Medium</Button>
              <Button size="large">Large</Button>
            </div>
          </div>
          
          {/* Button with Icons */}
          <div>
            <h3 className="text-lg font-medium mb-3">Button with Icons</h3>
            <div className="flex flex-wrap gap-3">
              <Button icon={<StarIcon />} iconPosition="left">Left Icon</Button>
              <Button icon={<StarIcon />} iconPosition="right">Right Icon</Button>
              <Button icon={<StarIcon />} iconPosition="only" aria-label="Star" />
            </div>
          </div>
          
          {/* Button States */}
          <div>
            <h3 className="text-lg font-medium mb-3">Button States</h3>
            <div className="flex flex-wrap gap-3">
              <Button disabled>Disabled</Button>
              <Button isLoading>Loading</Button>
              <Button isLoading variant="success">Loading with Text</Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Card Component Demo */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Card Component</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Card */}
          <Card>
            <Card.Body>
              <h3 className="text-lg font-medium mb-2">Basic Card</h3>
              <p>This is a simple card with just a body section.</p>
            </Card.Body>
          </Card>
          
          {/* Card with Header and Footer */}
          <Card>
            <Card.Header>Card Header</Card.Header>
            <Card.Body>
              <p>This card has a header and footer section.</p>
            </Card.Body>
            <Card.Footer>Card Footer</Card.Footer>
          </Card>
          
          {/* Card with Media */}
          <Card>
            <Card.Media 
              src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131" 
              alt="Sample image" 
              aspectRatio="16:9"
            />
            <Card.Body>
              <h3 className="text-lg font-medium mb-2">Card with Media</h3>
              <p>This card includes an image at the top.</p>
            </Card.Body>
          </Card>
          
          {/* Card with Hover Effect */}
          <Card variant="elevated" hoverEffect>
            <Card.Body>
              <h3 className="text-lg font-medium mb-2">Card with Hover Effect</h3>
              <p>Hover over this card to see the animation effect.</p>
            </Card.Body>
          </Card>
          
          {/* Card Variants */}
          <Card variant="bordered">
            <Card.Header>Bordered Card</Card.Header>
            <Card.Body>
              <p>This card uses the bordered variant.</p>
            </Card.Body>
          </Card>
          
          <Card variant="flat">
            <Card.Header>Flat Card</Card.Header>
            <Card.Body>
              <p>This card uses the flat variant.</p>
            </Card.Body>
          </Card>
        </div>
      </section>
      
      {/* Accordion Component Demo */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Accordion Component</h2>
        
        <div className="space-y-6">
          {/* Single Accordion */}
          <div>
            <h3 className="text-lg font-medium mb-3">Single Open Section</h3>
            <Accordion type="single" defaultIndex={0}>
              <AccordionItem header="Section 1">
                <p>This is the content for section 1. Only one section can be open at a time.</p>
                <p className="mt-2">Click on another section to close this one.</p>
              </AccordionItem>
              <AccordionItem header="Section 2">
                <p>This is the content for section 2.</p>
              </AccordionItem>
              <AccordionItem header="Section 3">
                <p>This is the content for section 3.</p>
              </AccordionItem>
            </Accordion>
          </div>
          
          {/* Multiple Accordion */}
          <div>
            <h3 className="text-lg font-medium mb-3">Multiple Open Sections</h3>
            <Accordion type="multiple" defaultIndex={[0, 2]}>
              <AccordionItem header="Section 1">
                <p>This is the content for section 1. Multiple sections can be open simultaneously.</p>
              </AccordionItem>
              <AccordionItem header="Section 2">
                <p>This is the content for section 2.</p>
              </AccordionItem>
              <AccordionItem header="Section 3">
                <p>This is the content for section 3.</p>
              </AccordionItem>
            </Accordion>
          </div>
          
          {/* Custom Header Accordion */}
          <div>
            <h3 className="text-lg font-medium mb-3">Custom Header</h3>
            <Accordion>
              <AccordionItem 
                header={
                  <div className="flex items-center">
                    <StarIcon />
                    <span className="ml-2">Custom Header with Icon</span>
                  </div>
                }
              >
                <p>This accordion item has a custom header with an icon.</p>
              </AccordionItem>
              <AccordionItem 
                header={
                  <div className="flex justify-between items-center w-full">
                    <span>Advanced Header</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">New</span>
                  </div>
                }
              >
                <p>This accordion item has an advanced custom header with a badge.</p>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReusableComponentsDemo;
