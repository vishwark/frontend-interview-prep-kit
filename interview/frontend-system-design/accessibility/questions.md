# Accessibility Interview Questions

These questions try to stay away from asking people to recite specifications, or rattle off screen reader hot keys. Those can easily be looked up on the job. Instead these questions try to act as conversation starters, to gain insight into how someone solves problems, and interprets accessible, inclusive user experiences.

Questions are grouped into four buckets:

- General,
- Technical,
- Design, and
- Content

These categories may be a mistake, but we're going with it for now. If you have ideas for categories, and questions in general, please let us know! Ideally a candidate would be able to answer questions from each category.

## General

- Who benefits from accessibility?
- How would you define inclusive and/or universal design?
  - Can you provide an example? (does not need to be web/tech related)
- How has your approach to accessibility changed over time?
- Name some ways responsive/mobile first design can affect accessibility.
- What are some user experience (UX) concerns to be aware of when using iconography in user interfaces (UI)?
- What assistive technologies (ATs) are you familiar with (desktop and/or mobile)?
  - What do you feel is your skill level with these AT(s)?
- What are skip links?
  - What benefit(s) do they provide?
  - What are some of their limitations?
- What are some of the tools available to test the accessibility of a website or web application?
- What is WCAG?
  - What are the differences between A, AA, and AAA compliance?
- How can using plain language benefit the accessibility of a project?
- Describe instances where one might use a link or button.
- Describe ways to convey an element or component's state that aren't entirely reliant on visuals.
- How can carousels be problematic for users with disabilities?
- How would you convince your Manager to allocate funds for an accessibility audit?
- Describe a situation where a coworker may have been resistant to accessibility or inclusive design best practices.
  - What sort of strategies do you use in situations like these to help educate coworkers?
- If one is looking to take on a leadership role:
  - Describe the kind of culture around accessibility you would create and how you would go about creating it
  - When there is more accessibility work to be done than the team can handle, how do you prioritize?
- If a client/stakeholder doesn't want to pay for accessibility what would you do?

### General Section Explanations

#### Who benefits from accessibility?
**Interview Perspective:** This question tests your understanding of the broad impact of accessibility. A strong answer acknowledges that accessibility benefits everyone, not just people with permanent disabilities.

**Key Points to Cover:**
- People with permanent disabilities (visual, auditory, motor, cognitive)
- People with temporary disabilities (broken arm, eye surgery recovery)
- People with situational limitations (bright sunlight on screen, noisy environment)
- Older adults experiencing age-related impairments
- Users with slow internet connections or older devices
- Mobile users who benefit from responsive design
- SEO benefits as accessible sites are typically more search-engine friendly
- All users benefit from clearer navigation, better organized content, and more intuitive interfaces

**Example Answer:** "While accessibility is critical for the 15-20% of the population with disabilities, it actually benefits everyone. For instance, captions help deaf users but also benefit people watching videos in noisy environments or those learning a language. Clear navigation and structure help screen reader users but also improve the experience for all users. Accessibility improvements often lead to better UX for everyone, following the principles of universal design."

#### How would you define inclusive and/or universal design?
**Interview Perspective:** This question evaluates your understanding of design philosophy beyond just technical compliance.

**Key Points to Cover:**
- Universal design creates products usable by all people without adaptation
- Inclusive design considers the full range of human diversity
- Focus on designing for edge cases improves the experience for everyone
- The difference between accessibility (minimum compliance) and true inclusion

**Example Answer:** "Universal design creates environments and products usable by all people without adaptation. Inclusive design actively considers the full range of human diversity including ability, language, culture, gender, age, and other forms of human difference. A classic non-tech example is curb cuts—designed for wheelchair users but beneficial for parents with strollers, travelers with luggage, delivery workers, and many others. In digital products, features like dark mode, originally designed for users with light sensitivity, now benefit everyone in low-light environments or who simply prefer it aesthetically."

#### Skip links
**Interview Perspective:** This tests your knowledge of specific accessibility features and their implementation.

**Key Points to Cover:**
- Definition: Links that allow keyboard users to bypass navigation menus
- Implementation: Usually the first focusable element, visible on focus
- Benefits: Saves time for keyboard and screen reader users
- Limitations: Must be properly implemented to be useful

**Example Answer:** "Skip links are navigation links that allow keyboard users to bypass repetitive navigation menus and jump directly to the main content. They're typically the first focusable element on a page but are visually hidden until they receive keyboard focus. They benefit keyboard and screen reader users by saving them from tabbing through numerous navigation links on every page. However, they have limitations—they must be properly implemented with visible focus states, and they don't solve all navigation issues for complex layouts. Additionally, they need to be consistently placed across a site to be truly effective."

#### WCAG Compliance Levels
**Interview Perspective:** This tests your knowledge of accessibility standards and requirements.

**Key Points to Cover:**
- WCAG stands for Web Content Accessibility Guidelines
- A (Minimum): Basic accessibility requirements that must be satisfied
- AA (Standard): Addresses the most common barriers; legal requirement in many countries
- AAA (Enhanced): Highest level of accessibility; not always achievable for all content

**Example Answer:** "WCAG, developed by the W3C, provides guidelines for making web content accessible. Level A covers the most basic requirements—without these, some users simply cannot access content at all. Level AA addresses common barriers and is the standard most organizations aim for—it's also the legal requirement in many countries and what's referenced in most accessibility legislation. Level AAA provides the highest level of accessibility but isn't always achievable for all content types. For example, AA requires a contrast ratio of 4.5:1 for normal text, while AAA requires 7:1, which can be challenging to implement across an entire design system while maintaining brand identity."

## Technical

- What methods can you use to find an element's accessible name?
- What is the accessibility tree?
- Why are rems or ems preferable to pixels for setting type size?
- Why is it important to allow the viewport to be resized, and/or zoomed?
- How is the title attribute exposed to assistive technologies?
  - What kind of elements can title attributes be used on?
  - What sort of information is appropriate for use with the title attribute?
- Provide an example of when you might need to add a description to an element.
  - How would you expose that description programmatically?
- What is a focus trap, or focus trapping?
  - Describe an instance of when you'd need focus trapping.
  - Describe an instance of when this would be an accessibility barrier.
- Describe a situation where the tabindex attribute would be useful.
  - Provide an example of when using the tabindex attribute can cause problems.
- What are landmark regions and how can they be useful?
- In what situations might you use a toggle button, vs a switch control, vs a checkbox?
- Describe methods to hide content:
  - From all users.
  - From only screen reader users.
  - From sighted users, but not screen reader users.
  - And why you might do so.
- Provide examples of common incorrect usage of ARIA attributes.
- Aside from screen readers, what other assistive technologies can be affected by use of ARIA? How?
- What is the difference between the following attributes: hidden, aria-hidden="true" and role="presentation" or role="none"?
- Describe instances where you might need to use aria-live.
  - What values (such as assertive or polite) might you give the attribute in different situations?
- How would you mark-up an icon font or SVG that was for decorative purposes?
- Is CSS pseudo content understood by screen readers?
- What is the purpose of the alt attribute for images?
  - Can you describe the effect of an empty alt, and/or the lack of the attribute, on an image?
  - In what instances might an empty alt or no alt be appropriate?
  - How might alternative text for an image vary, depending on the context the image is used in?
  - Since svgs don't accept the alt attribute, how can one provide alternative text for these graphics?
  - Do you need to supply an image an alt attribute if used witin a figure with a figcaption?
- Describe the steps you take in reviewing or auditing a website or application for accessibility?
- Describe an instance where an automated test would not flag a blatant accessibility error?
- When should you use or recommend ARIA roles or attributes to solve an accessibility issue?
- Describe your process for figuring out if an accessibility bug is due to a developer, browser, or assistive technology error?
- What is the difference between legend, caption and label elements?
  - What are their similarities?
- Describe the purpose of heading and header elements, and how they are useful in websites and applications.
- Describe how you'd handle managing keyboard focus within a single page web app (SPA) when changing routes.
- Name an ARIA attribute that requires either a child/parent relationship or a pairing role.
- What is your understanding of "accessible name computation" and how it affects modifying the way screen readers announce certain content?
- What are some issues with modifying normal scrolling behavior? For example: infinite scrolling or scrolljacking.
- Some ARIA widgets are presently best supported on devices with physical keyboard, rather than mobile/touch interfaces. Are you aware of any widgets that would be described this way, and why?

### Technical Section Explanations

#### Accessibility Tree
**Interview Perspective:** This question tests your understanding of how browsers process and expose accessibility information.

**Key Points to Cover:**
- Definition: A parallel structure to the DOM that browsers generate
- Purpose: Provides accessibility information to assistive technologies
- Relationship to DOM: Simplified version with accessibility properties
- How it's used by screen readers and other assistive tech

**Example Answer:** "The accessibility tree is a tree structure that browsers generate from the DOM, containing only the information relevant to accessibility APIs. It's essentially a simplified version of the DOM that assistive technologies like screen readers use to interpret and navigate web content. While the DOM contains all elements and properties needed to render a page visually, the accessibility tree focuses on semantic information, roles, states, properties, and relationships between elements. Understanding the accessibility tree helps developers comprehend how their code is actually interpreted by assistive technologies, which can be quite different from the visual rendering."

#### Rems/Ems vs. Pixels
**Interview Perspective:** This tests your understanding of responsive design principles and their impact on accessibility.

**Key Points to Cover:**
- Rems/ems are relative units that scale with user preferences
- Pixels are fixed units that don't respect user font size settings
- Impact on users with visual impairments who adjust browser settings
- Best practices for implementing responsive typography

**Example Answer:** "Rems and ems are preferable to pixels for text sizing because they respect user preferences and scale proportionally. When users adjust their browser's font size settings—which many users with visual impairments do—rems and ems will scale accordingly, while pixel values remain fixed. Rems are relative to the root element's font size, making them particularly useful for consistent scaling throughout an application. Ems are relative to the parent element's font size, which can be useful for component-specific scaling. Using these relative units is a fundamental aspect of creating truly responsive designs that adapt not just to different screen sizes but to user preferences as well."

#### Focus Trapping
**Interview Perspective:** This tests your knowledge of keyboard accessibility techniques and when they should be applied.

**Key Points to Cover:**
- Definition: Containing keyboard focus within a specific component
- Proper implementation: Using JavaScript to manage focus
- When it's needed: Modal dialogs, dropdown menus, etc.
- When it's problematic: If implemented incorrectly or unnecessarily

**Example Answer:** "Focus trapping is a technique that contains keyboard focus within a specific component, preventing users from tabbing outside of it until it's dismissed. It's essential for modal dialogs—when a modal is open, focus should be trapped inside it so keyboard users don't accidentally interact with the content behind it, which would create a confusing experience. However, focus trapping becomes an accessibility barrier when implemented incorrectly—for example, if there's no way to dismiss the modal with a keyboard or if the trap doesn't include all interactive elements. I typically implement focus trapping using a combination of tabindex attributes and JavaScript event listeners that manage focus and handle the Escape key for dismissal."

#### ARIA Attributes Usage
**Interview Perspective:** This tests your practical knowledge of ARIA implementation and common pitfalls.

**Key Points to Cover:**
- Common mistakes: Redundant roles, conflicting states
- First rule of ARIA: Don't use ARIA if HTML can do the job
- Testing and validation approaches
- Real-world examples of proper vs. improper usage

**Example Answer:** "Common incorrect ARIA usage includes adding redundant roles to elements that already have implicit roles (like `role='button'` on a `<button>` element), using incompatible roles and states together, or using ARIA without proper keyboard support. For example, adding `role='menu'` to a `<ul>` without implementing the expected keyboard interactions for menus creates a worse experience than using no ARIA at all. Another common mistake is using `aria-label` on non-interactive elements where it won't be announced by screen readers. The first rule of ARIA is not to use it when native HTML elements can provide the same functionality—for instance, using a properly labeled `<button>` is always better than making a `<div>` with `role='button'` and trying to recreate all the button behaviors."

#### Alt Attributes for Images
**Interview Perspective:** This tests your understanding of a fundamental accessibility requirement and its nuances.

**Key Points to Cover:**
- Purpose: Providing text alternatives for non-text content
- Empty alt attributes: When and why to use them
- Context-dependent descriptions
- Alternative approaches for SVGs and complex images

**Example Answer:** "The alt attribute provides text alternatives for images, allowing screen reader users to understand the content and function of images. The appropriate alt text depends on context—a logo might need the company name, while a decorative flourish might need an empty alt (`alt=""`) to indicate it should be skipped by screen readers. Missing the alt attribute entirely is problematic because screen readers will often announce the filename instead, creating a poor experience. For SVGs, since they don't accept the alt attribute directly, we can provide alternative text using `<title>` and `<desc>` elements within the SVG, or by using aria-label or aria-labelledby on the containing element. For images within figures, if the figcaption provides a complete description of the image, you can use an empty alt to avoid redundancy, though including alt text is still considered best practice for compatibility with all assistive technologies."

## Design

- Talk about the pros and cons of flat and skeuomorphic design trends in regards to accessibility.
- Explain the importance of color contrast in designing for inclusion.
- Besides :hover, name other states an actionable element (links, buttons, form controls, etc.) could have styles for, and why providing them is important?
- When might it be appropriate to remove the visual outline from a focused element?
- If a form or form field were to return an error message, where might you want those error messages to be located?
- How can utilizing animation in an interface affect the user experience?
- Explain how you could make an infographic accessible for screen reader users.
- Why is color alone insufficient to draw attention to actionable elements, or to convey state?
- What are some of the inclusive UX problems that need to be solved when content (static or actionable) is revealed on :hover, and how would you propose solving for them?

### Design Section Explanations

#### Color Contrast
**Interview Perspective:** This tests your understanding of visual accessibility principles and standards.

**Key Points to Cover:**
- WCAG requirements for contrast ratios
- Impact on users with low vision or color vision deficiencies
- Tools for testing contrast
- Balancing brand guidelines with accessibility needs

**Example Answer:** "Sufficient color contrast is crucial for users with low vision, color blindness, or those using devices in bright environments. WCAG 2.1 AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. For AAA compliance, these requirements increase to 7:1 and 4.5:1 respectively. Beyond compliance, good contrast benefits all users in various situations like outdoor use or on low-quality displays. When designing, I use tools like the WebAIM Contrast Checker or Stark plugin to verify my color combinations. When brand colors don't meet contrast requirements, I work with stakeholders to develop accessible alternatives for text and interactive elements while maintaining brand identity in other ways, such as through imagery or in less critical UI elements."

#### Interactive Element States
**Interview Perspective:** This tests your knowledge of comprehensive UI design that supports all users.

**Key Points to Cover:**
- Focus states for keyboard navigation
- Active states for current interaction
- Visited states for links
- Disabled states for unavailable options
- How these benefit different user groups

**Example Answer:** "Beyond hover states, interactive elements should have distinct styles for focus (when navigated to via keyboard), active (when being clicked/activated), and for links, visited states. Focus states are particularly crucial for keyboard users who need visual indication of their current position. These states should be visually distinct through multiple cues—not just color changes, but potentially also through borders, underlines, or other indicators. Disabled states need careful design to indicate unavailability while maintaining sufficient contrast. Each state provides important information to users about the element's current condition and availability. For example, a well-designed button might have a default state, a hover state with a slight color change, a focus state with a prominent outline, an active state showing depression, and potentially a disabled state with reduced opacity."

#### Hover-Revealed Content
**Interview Perspective:** This tests your ability to identify and solve common accessibility issues in modern interfaces.

**Key Points to Cover:**
- Problems with hover-dependent interactions
- Impact on mobile, touchscreen, and keyboard users
- Alternative approaches (click/tap toggles, visible controls)
- Progressive enhancement strategies

**Example Answer:** "Revealing content only on hover creates several accessibility issues: mobile and touchscreen users can't hover, keyboard users may never discover the content, and users with motor control difficulties may struggle to maintain a hover state. To solve these problems, I implement multiple interaction methods—making hover-revealed content also available through clicks/taps, ensuring all content is keyboard accessible, and providing visible indicators that more content is available. For tooltips and informational content, I ensure they're also available through other means, like visible help text or expandable sections. For navigation menus, I implement proper ARIA attributes and keyboard support so they can be operated without hovering. The key principle is to never make hover the only way to access content or functionality."

#### Making Infographics Accessible
**Interview Perspective:** This tests your ability to think creatively about complex accessibility challenges.

**Key Points to Cover:**
- Alternative text strategies for complex visuals
- Long descriptions and how to implement them
- Structured data approaches
- Balancing visual design with accessible alternatives

**Example Answer:** "Making infographics accessible requires a multi-layered approach. First, I provide a concise alt text that summarizes the overall purpose of the infographic. Then, I create a longer text alternative that captures all the data and relationships shown visually. This can be implemented through aria-describedby pointing to a visually hidden or expandable text section, or through a link to a page with the full text version. For complex data visualizations, I structure the alternative content logically, using headings, lists, and tables as appropriate to convey the hierarchical relationships in the data. When possible, I also provide the raw data in an accessible format. For interactive infographics, I ensure all interactions are keyboard accessible with appropriate ARIA roles and states. The goal is to provide equivalent information, not necessarily an identical experience, to users who can't perceive the visual presentation."

## Content

- What are some things you can do to make an accessible presentation?
- Is it possible to make email accessible?
- How can you make a podcast accessible?
- How would you make sure that a Word document is accessible?
- How would you make sure that an Excel spreadsheet document is accessible?
- Why is it important to tag a PDF correctly?
- What goes into making an accessible eBook?
- Tell me some social media accessibility best practices.
  - Facebook
  - Instagram
  - Pinterest
  - Snapchat
  - TikTok
  - Twitter
  - YouTube
- How would you handle a situation where your organization accidentally disseminates an inaccessible document?
- What do you think should happen if an employee repeatedly ignores making their documents accessible after being trained?
- What steps would you undertake to create a sustainable culture of creating accessible documents?
- In your previous experiences, was there an opportunity to insert accessibility checks and content authoring best practices into existing workflows?

### Content Section Explanations

#### Accessible Presentations
**Interview Perspective:** This tests your knowledge of accessibility beyond web development.

**Key Points to Cover:**
- Slide design principles (contrast, font size, layout)
- Alternative text for images and charts
- Providing materials in advance
- Speaking techniques for inclusivity
- Captioning and transcription options

**Example Answer:** "Creating accessible presentations involves multiple considerations. For the slides themselves, I use high-contrast color schemes, large readable fonts (minimum 24pt), and simple layouts with plenty of white space. I avoid relying solely on color to convey information and provide alt text for all images and charts. I make slide decks available in advance so attendees can review at their own pace or with their own assistive technology. During the presentation, I verbally describe important visual elements, face the audience when speaking for those who lip-read, use a microphone even in small rooms, and pace my speech. I also ensure videos include captions and provide a transcript of the presentation afterward. For virtual presentations, I choose platforms with accessibility features like live captioning and screen reader compatibility."

#### Accessible PDFs
**Interview Perspective:** This tests your understanding of document accessibility beyond HTML content.

**Key Points to Cover:**
- Proper document structure with tags
- Reading order and navigation
- Alternative text for images
- Form field accessibility
- Testing methods for PDF accessibility

**Example Answer:** "Properly tagging PDFs is crucial because tags provide the structure that assistive technologies need to navigate and understand the document. Without proper tags, a screen reader might read content in the wrong order, miss important information, or be unable to distinguish between headings, paragraphs, and other elements. Tags define the document's logical structure—headings, lists, tables, figures, and form fields—similar to HTML elements in a web page. They also establish the correct reading order, which may differ from the visual layout. Additionally, tagged PDFs support other accessibility features like alternative text for images, proper table markup with headers, and form fields with labels and instructions. When creating PDFs, I use authoring tools that support accessibility, run them through accessibility checkers, and test with actual screen readers to ensure they're truly usable."

#### Social Media Accessibility
**Interview Perspective:** This tests your awareness of accessibility in contemporary digital communication channels.

**Key Points to Cover:**
- Image descriptions and alt text across platforms
- Captioning videos
- Hashtag capitalization (CamelCase)
- Avoiding overuse of emojis
- Platform-specific considerations

**Example Answer:** "Social media accessibility varies by platform, but some universal best practices include: using CamelCase for hashtags (#SocialMediaAccessibility instead of #socialmediaaccessibility) to improve screen reader pronunciation; adding alt text to images (most platforms now support this natively); captioning videos or providing transcripts; limiting emoji use as they can be verbose and confusing when read by screen readers; and avoiding text in images when possible. For Twitter specifically, I keep image descriptions concise and place any thread numbering at the beginning of tweets for easier navigation. On Instagram, I include image descriptions in the caption when the alt text feature is insufficient. For Facebook, I ensure link previews have descriptive text and use the built-in alt text feature. On YouTube, I always add accurate captions and provide descriptive titles and summaries. These practices ensure content reaches the widest possible audience regardless of how they access social media."

#### Creating an Accessible Document Culture
**Interview Perspective:** This tests your leadership approach to accessibility and organizational change.

**Key Points to Cover:**
- Training and awareness programs
- Integration with existing workflows
- Templates and tools to simplify compliance
- Accountability and quality control measures
- Celebrating successes and improvements

**Example Answer:** "Creating a sustainable culture of accessible documents requires a multi-faceted approach. First, I'd establish clear guidelines and standards tailored to our organization's specific document types. Then, I'd develop or acquire templates that have accessibility built in, making it easier for everyone to create compliant documents from the start. Training is essential, but it needs to be ongoing and role-specific—showing people exactly how accessibility applies to their daily work. I'd integrate accessibility checks into existing review processes and workflows, so it becomes a natural part of document creation rather than an afterthought. To maintain momentum, I'd implement a system of regular audits, recognize teams that consistently produce accessible documents, and share success stories that demonstrate the positive impact. Most importantly, I'd work to shift the narrative from accessibility as a compliance burden to accessibility as a quality standard that benefits all users and reflects our organizational values."
